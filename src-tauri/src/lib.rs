use base64::{engine::general_purpose::STANDARD, Engine};
use jwalk::WalkDir;
use rayon::prelude::*;
use std::collections::HashMap;
use std::path::Path;
use std::sync::Mutex;
use tauri::Manager;
use tauri_plugin_fs::FsExt;

const IGNORED_DIRS: &[&str] = &[".git", ".github", "node_modules", ".vscode", ".idea", "__pycache__"];

#[tauri::command]
fn allow_directory(app: tauri::AppHandle, path: std::path::PathBuf) -> Result<(), String> {
    app.fs_scope().allow_directory(&path, true).map_err(|e| e.to_string())?;
    app.asset_protocol_scope().allow_directory(&path, true).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_directory_recursive(path: String) -> Result<HashMap<String, String>, String> {
    let root = Path::new(&path);
    let files: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());

    let entries: Vec<_> = WalkDir::new(root)
        .skip_hidden(false)
        .process_read_dir(|_, _, _, children| {
            children.retain(|entry| {
                entry.as_ref().is_ok_and(|e| {
                    let name = e.file_name().to_string_lossy();
                    !IGNORED_DIRS.contains(&name.as_ref())
                })
            });
        })
        .into_iter()
        .filter_map(Result::ok)
        .filter(|e| e.file_type().is_file())
        .collect();

    entries.par_iter().try_for_each(|entry| -> Result<(), String> {
        let entry_path = entry.path();
        let relative = entry_path
            .strip_prefix(root)
            .map_err(|e| e.to_string())?
            .to_string_lossy()
            .replace('\\', "/");
        let content = std::fs::read(&entry_path).map_err(|e| e.to_string())?;
        files
            .lock()
            .map_err(|e| format!("Mutex poisoned: {e}"))?
            .insert(relative, STANDARD.encode(&content));
        Ok(())
    })?;

    files
        .into_inner()
        .map_err(|e| format!("Mutex poisoned: {e}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![allow_directory, read_directory_recursive])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

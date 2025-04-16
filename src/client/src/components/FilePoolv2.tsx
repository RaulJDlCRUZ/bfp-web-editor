import React from 'react';
import { FileListProps } from '@/common/types';

const FileList: React.FC<FileListProps> = ({ files, onDownload, onDelete, onSelect }) => {
  if (files.length === 0) {
    return <div className="empty-list">No hay archivos disponibles</div>;
  }

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf': return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'txt': return '📃';
      case 'zip':
      case 'rar': return '🗜️';
      default: return '📁';
    }
  };

  return (
    <div className="file-list">
      <div className="file-list-header">
        <div className="file-select"></div>
        <div className="file-name">Nombre</div>
        <div className="file-actions">Acciones</div>
      </div>
      
      {files.map(file => (
        <div key={file.name} className={`file-item ${file.selected ? 'selected' : ''}`}>
          <div className="file-select">
            <input 
              type="checkbox" 
              checked={file.selected || false}
              onChange={(e) => onSelect(file.name, e.target.checked)}
            />
          </div>
          <div className="file-name">
            <span className="file-icon">{getFileIcon(file.name)}</span>
            {file.name}
          </div>
          <div className="file-actions">
            <button 
              className="download-btn" 
              onClick={() => onDownload(file.name)}
              title="Descargar"
            >
              ⬇️
            </button>
            <button 
              className="delete-btn" 
              onClick={() => onDelete(file.name)}
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
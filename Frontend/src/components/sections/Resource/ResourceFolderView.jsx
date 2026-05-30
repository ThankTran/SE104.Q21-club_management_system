import { useState } from 'react';
import { FolderClosed, FolderOpen } from 'lucide-react';
import { RESOURCE_FOLDER_TREE } from '../../../data/Resource/resourceFolderData';
import styles from './ResourceFolderView.module.css';

export default function ResourceFolderView({ selectedFolderId, folderCounts = {}, onSelectFolder }) {
  const [openFolderIds, setOpenFolderIds] = useState(() => new Set(RESOURCE_FOLDER_TREE.map((node) => node.id)));

  const toggleFolder = (folderId) => {
    setOpenFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  return (
    <div className={styles.folderTable}>
      <div className={styles.header}>
        <span>Thư mục</span>
        <span>Số tài liệu</span>
      </div>

      <div className={styles.tree}>
        {RESOURCE_FOLDER_TREE.map((node) => (
          <FolderNode
            key={node.id}
            node={node}
            depth={0}
            selectedFolderId={selectedFolderId}
            openFolderIds={openFolderIds}
            folderCounts={folderCounts}
            onToggle={toggleFolder}
            onSelectFolder={onSelectFolder}
          />
        ))}
      </div>
    </div>
  );
}

function FolderNode({ node, depth, selectedFolderId, openFolderIds, folderCounts, onToggle, onSelectFolder }) {
  const isLeaf = !node.children?.length;
  const open = openFolderIds.has(node.id);
  const selected = selectedFolderId === node.id;
  const count = getFolderCount(node, folderCounts);

  if (isLeaf) {
    return (
      <button
        type="button"
        className={`${styles.row} ${styles.leafRow} ${selected ? styles.rowActive : ''}`}
        style={{ paddingLeft: `${20 + depth * 24}px` }}
        onClick={() => onSelectFolder(node.id)}
      >
        <FolderClosed className={styles.folderIcon} />
        <span className={styles.name}>{node.label}</span>
        <span className={`${styles.countBadge} ${count === 0 ? styles.countBadgeEmpty : ''}`}>
          {count}
        </span>
      </button>
    );
  }

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.row}
        style={{ paddingLeft: `${20 + depth * 24}px` }}
        onClick={() => onToggle(node.id)}
      >
        {open ? (
          <FolderOpen className={styles.folderIcon} />
        ) : (
          <FolderClosed className={styles.folderIcon} />
        )}
        <span className={styles.name}>{node.label}</span>
        <span className={`${styles.countBadge} ${count === 0 ? styles.countBadgeEmpty : ''}`}>
          {count}
        </span>
      </button>

      {open && node.children.map((child) => (
        <FolderNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedFolderId={selectedFolderId}
          openFolderIds={openFolderIds}
          folderCounts={folderCounts}
          onToggle={onToggle}
          onSelectFolder={onSelectFolder}
        />
      ))}
    </div>
  );
}

function getFolderCount(node, folderCounts) {
  if (!node.children?.length) {
    return folderCounts[node.id] || 0;
  }

  return node.children.reduce((total, child) => total + getFolderCount(child, folderCounts), 0);
}

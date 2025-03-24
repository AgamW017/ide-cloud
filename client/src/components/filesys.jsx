const FileNode = ({ filename, nodes, onSelect, path}) =>
{
    const isDir = !!nodes;
    return(
        <div onClick={(e) => {
            e.stopPropagation
            if (isDir) return;
            onSelect(path)
        }} style={{marginLeft:'10px'}}>
            <p className={isDir? 'foldernode' : 'filenode'} >{filename}</p>
             {nodes && <ul> 
                {Object.keys(nodes).map(child => (
                    <li key={child}>
                        <FileNode filename={child} nodes={nodes[child]} path={path+'/'+child} onSelect={onSelect}/>
                    </li>
                ))}
                </ul>}
        </div>
    )
}
const FileTree = ({tree, onSelect}) =>{
    return(
        <FileNode filename='/' nodes={tree} path='' onSelect={onSelect}/>
    )
}

export default FileTree;
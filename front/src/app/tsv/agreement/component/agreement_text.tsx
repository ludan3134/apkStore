// import React, { useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import 'react-quill/dist/quill.bubble.css';
//
//
// export function Agreement_text() {
//     const [value, setValue] = useState('');
//     const modules = {
//         toolbar: [
//             ["bold", "italic", "underline", "strike", "blockquote"],
//             [{ header: [1, 2, false] }],
//             [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
//             ["clean"],
//             [{ size: ["small", false, "large", "huge"] }],
//             [{ color: [] }, { background: [] }],
//         ]
//     };
//     // 一个函数，当按钮被点击时触发
//     const handleReadValue = () => {
//         console.log(value); // 这里读取并打印value的值
//     };
//     return (
//         <>
//             <ReactQuill theme="snow" modules={modules} value={value} onChange={setValue} />
//         </>
//     );
// }

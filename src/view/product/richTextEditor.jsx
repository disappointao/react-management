import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class RichTextEditor extends Component {
static propTypes={
html:PropTypes.string
}

constructor(props) {
    super(props);
    const html = this.props.html;
    if(html){
    const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          this.state = {
            editorState,
          };
        }
    }else{
    this.state={
    editorState: EditorState.createEmpty(),
    }
    }
  }
  getDetail = () => {
     return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
   }
  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };
  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          const url = response.data.url;
          resolve({data: {link: url}});
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        })
      }
    )
  }
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{border:'1px solid #ff9f43',borderRadius:'10px',height:200,padding:'0 20px'}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                  }}
        />
      </div>
    );
  }
}
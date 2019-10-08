/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @emails oncall+draft_js
 */
'use strict';

var ReactDOM = require("react-dom");

var invariant = require("fbjs/lib/invariant");

function getContentEditableContainer(editor) {
  var editorNode = ReactDOM.findDOMNode(editor.editorContainer);
  !editorNode ? process.env.NODE_ENV !== "production" ? invariant(false, 'Missing editorNode') : invariant(false) : void 0;
  !(editorNode.firstChild instanceof HTMLElement) ? process.env.NODE_ENV !== "production" ? invariant(false, 'editorNode.firstChild is not an HTMLElement') : invariant(false) : void 0;
  return editorNode.firstChild;
}

module.exports = getContentEditableContainer;
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

var onBeforeInput = require("./editOnBeforeInput");

var onBlur = require("./editOnBlur");

var onCompositionStart = require("./editOnCompositionStart");

var onCopy = require("./editOnCopy");

var onCut = require("./editOnCut");

var onDragOver = require("./editOnDragOver");

var onDragStart = require("./editOnDragStart");

var onFocus = require("./editOnFocus");

var onInput = require("./editOnInput");

var onKeyDown = require("./editOnKeyDown");

var onPaste = require("./editOnPaste");

var onSelect = require("./editOnSelect");

var DraftEditorEditHandler = {
  onBeforeInput: onBeforeInput,
  onBlur: onBlur,
  onCompositionStart: onCompositionStart,
  onCopy: onCopy,
  onCut: onCut,
  onDragOver: onDragOver,
  onDragStart: onDragStart,
  onFocus: onFocus,
  onInput: onInput,
  onKeyDown: onKeyDown,
  onPaste: onPaste,
  onSelect: onSelect
};
module.exports = DraftEditorEditHandler;
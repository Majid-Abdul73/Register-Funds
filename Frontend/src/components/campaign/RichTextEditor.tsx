import React, { useState, useCallback, useRef } from 'react';
import {
  Editor, EditorState, RichUtils, getDefaultKeyBinding, convertFromRaw, 
  ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  showTips?: boolean;
  onToggleTips?: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your description...",
  maxLength = 200,
  showTips = false,
  onToggleTips
}) => {
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      try {
        // Try to parse as Draft.js raw content first
        const contentState = convertFromRaw(JSON.parse(value));
        return EditorState.createWithContent(contentState);
      } catch {
        // If parsing fails, treat as plain text
        return EditorState.createWithContent(ContentState.createFromText(value));
      }
    }
    return EditorState.createEmpty();
  });

  // Using ref to avoid stale closure issues
  const editorStateRef = useRef(editorState);
  editorStateRef.current = editorState;

  const handleEditorChange = useCallback((newEditorState: EditorState) => {
    const newContentState = newEditorState.getCurrentContent();
    const newPlainText = newContentState.getPlainText();
    const currentContentState = editorStateRef.current.getCurrentContent();
    const currentPlainText = currentContentState.getPlainText();
    
    // More robust character limit checking
    const isWithinLimit = newPlainText.length <= maxLength;
    const isDeleting = newPlainText.length < currentPlainText.length;
    const isFormatting = newPlainText === currentPlainText; // Same text, just formatting
    

    if (isWithinLimit || isDeleting || isFormatting) {
      setEditorState(newEditorState);
      
      // Only call onChange if the text actually changed
      if (newPlainText !== currentPlainText) {
        onChange(newPlainText);
      }
    }
    // If over limit and not deleting/formatting, don't update state
  }, [onChange, maxLength]);

  const handleKeyCommand = useCallback((command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }, [handleEditorChange]);

  const mapKeyToEditorCommand = useCallback((e: React.KeyboardEvent) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        editorState,
        4 /* maxDepth */
      );
      if (newEditorState !== editorState) {
        handleEditorChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }, [editorState, handleEditorChange]);

  const toggleInlineStyle = useCallback((inlineStyle: string) => {
    handleEditorChange(
      RichUtils.toggleInlineStyle(editorState, inlineStyle)
    );
  }, [editorState, handleEditorChange]);

  const toggleBlockType = useCallback((blockType: string) => {
    handleEditorChange(
      RichUtils.toggleBlockType(editorState, blockType)
    );
  }, [editorState, handleEditorChange]);

  const insertLink = useCallback(() => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const url = prompt('Enter URL:');
      if (url) {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          'LINK',
          'MUTABLE',
          { url }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentStateWithEntity,
        });
        handleEditorChange(
          RichUtils.toggleLink(
            newEditorState,
            newEditorState.getSelection(),
            entityKey
          )
        );
      }
    }
  }, [editorState, handleEditorChange]);

  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const currentLength = editorState.getCurrentContent().getPlainText().length;

  return (
    <div className="rich-text-editor">
      {/* Header with Tips Toggle */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Description</h2>
        {onToggleTips && (
          <button
            type="button"
            onClick={onToggleTips}
            className="text-sm text-register-green hover:text-green-600 underline"
          >
            {showTips ? 'Hide tips' : 'Show writing tips'}
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        Tell your story and explain why people should support your campaign. Use formatting to make it engaging!
      </p>

      {/* Writing Tips */}
      {showTips && (
        <div className="mb-4 p-4 bg-green-50 border border-blue-200 rounded-md">
          <h3 className="font-medium text-blue-900 mb-2">Tips for writing a compelling campaign description:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Start with the problem:</strong> What challenge are you addressing?</li>
            <li>• <strong>Explain your solution:</strong> How will donations help solve this problem?</li>
            <li>• <strong>Be specific:</strong> Include concrete details about how funds will be used</li>
            <li>• <strong>Use headings:</strong> Break up text with different heading levels</li>
            <li>• <strong>Add emphasis:</strong> Use bold and italic text for key points</li>
            <li>• <strong>Include links:</strong> Reference relevant websites or resources</li>
            <li>• <strong>Keep it concise:</strong> Make every word count within the {maxLength} character limit</li>
          </ul>
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="mb-2 p-2 border border-gray-200 rounded-t-md bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {/* Inline Styles */}
          <button
            type="button"
            onClick={() => toggleInlineStyle('BOLD')}
            className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 font-bold ${
              currentStyle.has('BOLD') ? 'bg-gray-200' : ''
            }`}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => toggleInlineStyle('ITALIC')}
            className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 italic ${
              currentStyle.has('ITALIC') ? 'bg-gray-200' : ''
            }`}
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => toggleInlineStyle('UNDERLINE')}
            className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 underline ${
              currentStyle.has('UNDERLINE') ? 'bg-gray-200' : ''
            }`}
            title="Underline"
          >
            U
          </button>
          
          <div className="border-l border-gray-300 mx-1"></div>
          
          {/* Block Types */}
          <button
            type="button"
            onClick={() => toggleBlockType('header-one')}
            className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
              blockType === 'header-one' ? 'bg-gray-200' : ''
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => toggleBlockType('header-two')}
            className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
              blockType === 'header-two' ? 'bg-gray-200' : ''
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => toggleBlockType('header-three')}
            className={`px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
              blockType === 'header-three' ? 'bg-gray-200' : ''
            }`}
            title="Heading 3"
          >
            H3
          </button>
          
          <div className="border-l border-gray-300 mx-1"></div>
          
          <button
            type="button"
            onClick={insertLink}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            title="Insert Link"
          >
            🔗
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative border border-gray-300 rounded-b-md min-h-[150px]">
        <div className="p-3">
          <div className="[&_.DraftEditor-root]:font-inherit [&_.DraftEditor-root]:text-sm [&_.DraftEditor-root]:leading-6 [&_.DraftEditor-editorContainer]:min-h-[120px] [&_.public-DraftEditor-content]:min-h-[120px] [&_.public-DraftEditorPlaceholder-root]:text-gray-400 [&_.public-DraftEditorPlaceholder-root]:absolute [&_.public-DraftEditorPlaceholder-root]:z-[1] [&_.public-DraftStyleDefault-block]:my-2 [&_.public-DraftStyleDefault-block:first-child]:mt-0 [&_.public-DraftStyleDefault-block:last-child]:mb-0 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:my-2 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_ul]:my-2 [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:pl-6 [&_li]:my-1 [&_a]:text-green-600 [&_a]:underline [&_a:hover]:text-green-700 [&_.DraftEditor-editorContainer:focus-within]:outline-none">
            <Editor
              editorState={editorState}
              onChange={handleEditorChange}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={(e: any) => mapKeyToEditorCommand(e) || null}
              placeholder={placeholder}
              spellCheck={true}
            />
          </div>
        </div>
        
        {/* Character Counter */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {currentLength}/{maxLength}
        </div>
      </div>
      
      {/* Character Limit Warnings */}
      {currentLength >= maxLength * 0.9 && currentLength < maxLength && (
        <p className="text-xs text-orange-600 mt-1">
          {maxLength - currentLength} characters remaining
        </p>
      )}
      
      {currentLength === maxLength && (
        <p className="text-xs text-red-600 mt-1">
          Character limit reached
        </p>
      )}
    </div>
  );
};

export default RichTextEditor;
use std::path::PathBuf;
use swc_common::{SourceMapper, Span};
use swc_ecma_ast::*;
mod node;
use node::{Position, TagInfo, TemplateNode};

pub fn get_data_onlook_id(
    el: JSXElement,
    source_mapper: &dyn SourceMapper,
    project_root: &PathBuf,
    absolute: bool,
    commit: Option<&str>,
) -> String {
    let mut path: String = source_mapper.span_to_filename(el.span).to_string();
    if absolute {
        let abs_path_buf: PathBuf = PathBuf::from(path);
        path = abs_path_buf
            .strip_prefix(&project_root)
            .unwrap_or_else(|_| &abs_path_buf)
            .to_string_lossy()
            .to_string();
    }
    let (opening_start_line, opening_end_line, opening_start_column, opening_end_column) =
        get_span_info(el.opening.span, source_mapper);

    let start_tag = TagInfo {
        start: Position {
            line: opening_start_line,
            column: opening_start_column,
        },
        end: Position {
            line: opening_end_line,
            column: opening_end_column,
        },
    };

    let mut end_tag: Option<TagInfo> = None;

    // Fill end_tag if el.closing
    if let Some(closing) = el.closing {
        let (closing_start_line, closing_end_line, closing_start_column, closing_end_column) =
            get_span_info(closing.span, source_mapper);

        end_tag = Some(TagInfo {
            start: Position {
                line: closing_start_line,
                column: closing_start_column,
            },
            end: Position {
                line: closing_end_line,
                column: closing_end_column,
            },
        });
    }

    let template_node = TemplateNode {
        path: path,
        start_tag: start_tag,
        end_tag: end_tag,
        commit: commit.unwrap().to_string(),
    };

    return path;
}

pub fn get_span_info(span: Span, source_mapper: &dyn SourceMapper) -> (usize, usize, usize, usize) {
    let span_lines = source_mapper.span_to_lines(span).unwrap().lines;
    let start_line: usize = span_lines[0].line_index;
    let end_line: usize = span_lines.last().unwrap().line_index;
    let start_column: usize = span_lines[0].start_col.0;
    let end_column: usize = span_lines.last().unwrap().end_col.0;
    (start_line, end_line, start_column, end_column)
}

pub fn get_opening_start_and_end(
    source_mapper: &dyn SourceMapper,
    el: JSXOpeningElement,
    offset: usize,
) -> (usize, usize) {
    let span_lines = source_mapper.span_to_lines(el.span).unwrap().lines;

    let start_line: usize = span_lines[0].line_index + offset;
    let end_line: usize = span_lines.last().unwrap().line_index + offset;
    (start_line, end_line)
}

pub fn get_closing_end(
    source_mapper: &dyn SourceMapper,
    el: JSXClosingElement,
    offset: usize,
) -> usize {
    let span_lines = source_mapper.span_to_lines(el.span).unwrap().lines;
    let end_line: usize = span_lines.last().unwrap().line_index + offset;
    end_line
}

pub fn create_hidden_input(span: Span, git_commit: String) -> JSXElement {
    JSXElement {
        span,
        opening: JSXOpeningElement {
            span,
            name: JSXElementName::Ident(Ident::new("input".into(), span)),
            attrs: vec![
                JSXAttrOrSpread::JSXAttr(JSXAttr {
                    span,
                    name: JSXAttrName::Ident(Ident::new("type".into(), span)),
                    value: Some(JSXAttrValue::Lit(Lit::Str(Str {
                        span,
                        value: "hidden".into(),
                        raw: None,
                    }))),
                }),
                JSXAttrOrSpread::JSXAttr(JSXAttr {
                    span,
                    name: JSXAttrName::Ident(Ident::new("data-onlook-snapshot".into(), span)),
                    value: Some(JSXAttrValue::Lit(Lit::Str(Str {
                        span,
                        value: git_commit.into(),
                        raw: None,
                    }))),
                }),
            ],
            self_closing: true,
            type_args: None,
        },
        closing: None,
        children: vec![],
    }
}

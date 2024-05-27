use std::path::PathBuf;
use swc_common::{SourceMapper, Span};
use swc_ecma_ast::*;

pub fn generate_data_attribute_value(
    project_root: &PathBuf,
    path: &str,
    opening_start: usize,
    opening_end: usize,
    closing_end: usize,
    absolute: bool,
) -> String {
    if absolute {
        return format!("{}:{}:{}:{}", path, opening_start, opening_end, closing_end);
    }

    // Get relative path
    let abs_path_buf: PathBuf = PathBuf::from(path);
    let relative_path: String = abs_path_buf
        .strip_prefix(&project_root)
        .unwrap_or_else(|_| &abs_path_buf)
        .to_string_lossy()
        .to_string();

    format!(
        "{}:{}:{}:{}",
        relative_path, opening_start, opening_end, closing_end
    )
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

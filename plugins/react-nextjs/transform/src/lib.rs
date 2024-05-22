use serde::Deserialize;
use std::path::PathBuf;
use std::sync::Arc;
use swc_common::SourceMapper;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

#[derive(Clone, Debug, Deserialize)]
#[serde(untagged)]
pub enum Config {
    All(bool),
    WithOptions(Options),
}

impl Config {
    pub fn project_root(&self) -> Option<&str> {
        match self {
            Config::WithOptions(opts) => Some(&opts.project_root),
            _ => None,
        }
    }

    pub fn absolute(&self) -> bool {
        match self {
            Config::WithOptions(opts) => opts.absolute,
            _ => false,
        }
    }
}

#[derive(Clone, Debug, Deserialize)]
pub struct Options {
    #[serde(rename = "root")]
    pub project_root: String,
    #[serde(default)]
    pub absolute: bool,
}

pub fn onlook_react(config: Config, source_map: Arc<dyn SourceMapper>) -> impl Fold {
    AddProperties { config, source_map }
}

struct AddProperties {
    config: Config,
    source_map: Arc<dyn SourceMapper>,
}

impl AddProperties {}

impl Fold for AddProperties {
    noop_fold_type!();

    fn fold_jsx_element(&mut self, mut el: JSXElement) -> JSXElement {
        // Process children first to ensure last_jsx_closing_line is updated before processing opening element
        el.children = el.children.fold_children_with(self);

        let source_mapper: &dyn SourceMapper = self.source_map.get_code_map();
        let offset = 1;
        // Process opening and closing elements
        let (opening_start, opening_end) =
            get_opening_start_and_end(source_mapper, el.opening.clone(), offset);

        let closing_end = match el.closing.clone() {
            Some(closing_element) => get_closing_end(source_mapper, closing_element, offset),
            None => opening_end,
        };

        let project_root = self
            .config
            .project_root()
            .map(PathBuf::from)
            .unwrap_or_else(|| PathBuf::from("."));

        let path: String = source_mapper.span_to_filename(el.span).to_string();

        let file_line: String = generate_data_attribute_value(
            &project_root,
            &path,
            opening_start,
            opening_end,
            closing_end,
            self.config.absolute(),
        );

        let class_name_attr: JSXAttrOrSpread = JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: el.span,
            name: JSXAttrName::Ident(Ident {
                sym: "data-onlook-id".into(),
                span: el.span,
                optional: false,
            }),
            value: Some(JSXAttrValue::Lit(Lit::Str(Str {
                span: el.span,
                value: file_line.into(),
                raw: None,
            }))),
        });

        el.opening.attrs.push(class_name_attr);
        el
    }
}

fn get_opening_start_and_end(
    source_mapper: &dyn SourceMapper,
    el: JSXOpeningElement,
    offset: usize,
) -> (usize, usize) {
    let span_lines = source_mapper.span_to_lines(el.span).unwrap().lines;
    let start_line: usize = span_lines[0].line_index + offset;
    let end_line: usize = span_lines.last().unwrap().line_index + offset;
    (start_line, end_line)
}

fn get_closing_end(
    source_mapper: &dyn SourceMapper,
    el: JSXClosingElement,
    offset: usize,
) -> usize {
    let span_lines = source_mapper.span_to_lines(el.span).unwrap().lines;
    let end_line: usize = span_lines.last().unwrap().line_index + offset;
    end_line
}

fn generate_data_attribute_value(
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

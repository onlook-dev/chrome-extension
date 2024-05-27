mod helpers;
use helpers::{
    create_hidden_input, generate_data_attribute_value, get_closing_end, get_opening_start_and_end,
};
use serde::Deserialize;
use std::path::PathBuf;
use std::sync::Arc;
use swc_common::SourceMapper;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

use std::sync::atomic::{AtomicBool, Ordering};
static SNAPSHOT_ADDED: AtomicBool = AtomicBool::new(false);

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

pub fn preprocess(config: Config, source_map: Arc<dyn SourceMapper>) -> impl Fold {
    AddProperties::new(config, source_map)
}

struct AddProperties {
    config: Config,
    source_map: Arc<dyn SourceMapper>,
}

impl AddProperties {
    fn new(config: Config, source_map: Arc<dyn SourceMapper>) -> Self {
        Self { config, source_map }
    }
}

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

        let data_attribute = JSXAttrOrSpread::JSXAttr(JSXAttr {
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

        el.opening.attrs.push(data_attribute);

        // Add hidden input with commit info if not added already
        if !SNAPSHOT_ADDED.load(Ordering::Relaxed) {
            if let JSXElementName::Ident(ident) = &el.opening.name {
                if ident.sym == *"body" {
                    let hidden_input = create_hidden_input(el.span);
                    el.children
                        .push(JSXElementChild::JSXElement(Box::new(hidden_input)));
                    SNAPSHOT_ADDED.store(true, Ordering::Relaxed);
                }
            }
        }

        el
    }
}

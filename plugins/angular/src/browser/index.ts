import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { BrowserBuilderOptions, executeBrowserBuilder } from '@angular-devkit/build-angular';
import { json } from '@angular-devkit/core';
import { getTransforms } from '../transform-factories';
import { CustomWebpackSchema } from '../custom-webpack-schema';
import { preprocess, postprocess } from '../transform';

export type CustomWebpackBrowserSchema = BrowserBuilderOptions & CustomWebpackSchema;

export const buildCustomWebpackBrowser = (
  options: CustomWebpackBrowserSchema,
  context: BuilderContext
): ReturnType<typeof executeBrowserBuilder> =>
 { 
  
    const fileMap = new Map<string, string>();
    
    function teardown() {
      postprocess(fileMap);
      process.exit(0);
    }

    // Handle process interrupts and cleanup
    process.on('SIGINT', () => {
      teardown();
    });

    process.on('SIGTERM', () => {
      teardown();
    });

    preprocess(fileMap);
    context.addTeardown(teardown);
    const builder = executeBrowserBuilder(options, context, getTransforms(options, context))
    builder.subscribe(() => teardown());
    builder
    return builder;
  }

export default createBuilder<json.JsonObject & CustomWebpackBrowserSchema>(
  buildCustomWebpackBrowser
);

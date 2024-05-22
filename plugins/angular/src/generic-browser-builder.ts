import {
  BuilderContext,
  targetFromTargetString,
  BuilderHandlerFn,
} from '@angular-devkit/architect';
import { ExecutionTransformer } from '@angular-devkit/build-angular';
import { IndexHtmlTransform } from '@angular-devkit/build-angular/src/utils/index-file/index-html-generator';
import { from } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { Configuration } from 'webpack';
import { CustomWebpackSchema } from './custom-webpack-schema';
import { getTransforms } from './transform-factories';
import { json } from '@angular-devkit/core';
import { preprocess, postprocess } from './transform';

export interface BrowserTargetOptions {
  buildTarget?: string;
  browserTarget?: string;
}

export type BuilderExecutor<O extends BrowserTargetOptions & json.JsonObject> = (
  options: O,
  context: BuilderContext,
  transforms?: {
    webpackConfiguration?: ExecutionTransformer<Configuration>;
    indexHtml?: IndexHtmlTransform;
  }
) => any;

export const executeBrowserBasedBuilder =
  <O extends BrowserTargetOptions & json.JsonObject>(
    executeBuilder: BuilderExecutor<O>
  ): BuilderHandlerFn<O> =>
  (options: O, context: BuilderContext): ReturnType<typeof executeBuilder> => {

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
    
    async function setup() {
      const browserTarget = targetFromTargetString(
        // `browserTarget` has been deprecated.
        options.buildTarget ?? options.browserTarget!
      );
      return context.getTargetOptions(browserTarget) as unknown as CustomWebpackSchema;
    }

    return from(setup()).pipe(
      switchMap(customWebpackOptions =>  {
          preprocess(fileMap);
          context.addTeardown(teardown);
          const builder = executeBuilder(options, context, getTransforms(customWebpackOptions, context))
          return builder;
      }),
      finalize(() => {
        teardown();
      })
    )
  };

import path             from 'path';
import fs               from 'fs';
import Metalsmith       from 'metalsmith';
import collections      from 'metalsmith-collections';
import metadata         from 'metalsmith-metadata';
import markdown         from 'metalsmith-markdown';
import layouts          from 'metalsmith-layouts';
import inPlace          from 'metalsmith-in-place';
import permalinks       from 'metalsmith-permalinks';
import pagination       from 'metalsmith-pagination';
import excerpts         from 'metalsmith-excerpts';
import sass             from 'metalsmith-sass';
import moment           from 'moment';
import define           from 'metalsmith-define';
import jekyllDates      from 'metalsmith-jekyll-dates';
import autoprefixer     from 'metalsmith-autoprefixer';
import webpack          from 'metalsmith-webpack';
import ignore           from 'metalsmith-ignore';
// prod
import htmlMinifier     from 'metalsmith-html-minifier';
import fingerprint      from 'metalsmith-fingerprint';
import imagemin         from 'metalsmith-imagemin';
import sitemap          from 'metalsmith-sitemap';
import firebase         from 'metalsmith-firebase';
import rss              from 'metalsmith-rss';
import drafts           from 'metalsmith-drafts';

const DEFAULT_OPTIONS = {
  title: 'MetalPress',
  description: 'Website to MetalPress',
  url: 'https://metalpress.io',
  sitemapPath: 'sitemap.xml',
  ignore: [
    '_data/**',
    '_drafts/*.md',
    'templates/**',
    'lib/**'
  ],
  markdown: {
    gfm: true,
    tables: true
  },
  layouts: {
    engine: 'liquid',
    directory: 'templates/_layouts',
    includeDir: 'templates/_includes'
  },
  inPlace: {
    engine: 'liquid',
    pattern: '**/*.liquid',
    includeDir: 'templates/_includes'
  },
  sass: {
    outputDir: 'assets/css',
    sourceMap: true,
    sourceMapEmbed: true
  },
  imagemin: {
    optimizationLevel: 4,
    progressive: true
  },
  htmlMinifier: {
    removeComments: false,
    removeEmptyAttributes: false
  }
};

export default function (config = {}, callback) {

  const options = Object.assign({}, DEFAULT_OPTIONS, config);

  // Config
  // --------------------------------------------------------------------------
  const m = new Metalsmith(options.basePath);

  // Metalsmith options
  // --------------------------------------------------------------------------
  m.clean(true);
  m.destination('dist');

  // File Metadata
  // --------------------------------------------------------------------------
  m.use(metadata(options.metadata));

  // Firebase
  // --------------------------------------------------------------------------
  if (options.firebase) {
    m.use(firebase(options.firebase));
  }

  // Ignores
  // --------------------------------------------------------------------------
  m.use(ignore(options.ignore));

  if (options.production) {
    m.use(drafts());
  }

  // Definitions
  // --------------------------------------------------------------------------
  m.use(define({ moment }));

  // Attach Collections
  // --------------------------------------------------------------------------
  m.use(collections(options.collections));

  // Date
  // --------------------------------------------------------------------------
  m.use(jekyllDates());

  // Markdown
  // --------------------------------------------------------------------------
  m.use(markdown(options.markdown));

  // Excerpts
  // --------------------------------------------------------------------------
  m.use(excerpts());

  // Permalinks
  // --------------------------------------------------------------------------
  m.use(permalinks(options.permalinks));

  // Pagination
  // --------------------------------------------------------------------------
  if (options.pagination) {
    m.use(pagination(options.pagination));
  }

  // Templates
  // --------------------------------------------------------------------------
  m.use(layouts(options.layouts));
  m.use(inPlace(options.inPlace));

  // Styles
  // --------------------------------------------------------------------------
  if (options.production) {
    options.sass.outputStyle = 'compressed';
    m.use(sass(options.sass));
  } else {
    m.use(sass(options.sass));
  }
  m.use(autoprefixer());

  // Js
  // --------------------------------------------------------------------------
  if (options.webpack) {
    if (options.production) {
      m.use(webpack(options.webpackProd));
    } else {
      m.use(webpack(options.webpack));
    }
  }

  // Sitemap
  // --------------------------------------------------------------------------
  if (options.production) {
    m.use(sitemap(options.sitemap));
  }

  // RSS Feed
  // --------------------------------------------------------------------------
  if (options.rss) {
    if (options.production) {
      m.use(rss(options.rss));
    }
  }

  // Production
  // --------------------------------------------------------------------------
  if (options.production) {
    m.use(imagemin(options.imagemin));
    m.use(htmlMinifier('*.html', options.htmlMinifier));
  }

  // Build
  // --------------------------------------------------------------------------
  m.build(callback);

  return options;

}
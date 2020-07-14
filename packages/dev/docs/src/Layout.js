/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import classNames from 'classnames';
import {Divider} from '@react-spectrum/divider';
import docStyles from './docs.css';
import {getAnchorProps} from './utils';
import linkStyle from '@adobe/spectrum-css-temp/components/link/vars.css';
import {MDXProvider} from '@mdx-js/react';
import React from 'react';
import typographyStyles from '@adobe/spectrum-css-temp/components/typography/vars.css';

const mdxComponents = {
  h1: ({children, ...props}) => (
    <h1 {...props} className={classNames(typographyStyles['spectrum-Heading1--display'], typographyStyles['spectrum-Article'], docStyles['articleHeader'])}>
      {children}
    </h1>
  ),
  h2: ({children, ...props}) => (
    <>
      <h2 {...props} className={classNames(typographyStyles['spectrum-Heading3'], docStyles['sectionHeader'], docStyles['docsHeader'])}>
        {children}
        <span className={classNames(docStyles['headingAnchor'])}>
          <a className={classNames(linkStyle['spectrum-Link'], docStyles.link, docStyles.anchor)} href={`#${props.id}`}>#</a>
        </span>
      </h2>
      <Divider marginBottom="33px" />
    </>
  ),
  h3: ({children, ...props}) => (
    <h3 {...props} className={classNames(typographyStyles['spectrum-Heading4'], docStyles['sectionHeader'], docStyles['docsHeader'])}>
      {children}
      <span className={docStyles['headingAnchor']}>
        <a className={classNames(linkStyle['spectrum-Link'], docStyles.link, docStyles.anchor)} href={`#${props.id}`} aria-label="§">#</a>
      </span>
    </h3>
  ),
  p: ({children, ...props}) => <p className={typographyStyles['spectrum-Body3']} {...props}>{children}</p>,
  ul: ({children, ...props}) => <ul {...props} className={typographyStyles['spectrum-Body3']}>{children}</ul>,
  code: ({children, ...props}) => <code {...props} className={typographyStyles['spectrum-Code4']}>{children}</code>,
  inlineCode: ({children, ...props}) => <code {...props} className={typographyStyles['spectrum-Code4']}>{children}</code>,
  a: ({children, ...props}) => <a {...props} className={classNames(linkStyle['spectrum-Link'], docStyles.link)} {...getAnchorProps(props.href)}>{children}</a>,
  kbd: ({children, ...props}) => <kbd {...props} className={docStyles['keyboard']}>{children}</kbd>
};

export function Layout({scripts, styles, pages, currentPage, publicUrl, children, toc}) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        {styles.map(s => <link rel="stylesheet" href={s.url} />)}
        {scripts.map(s => <script type={s.type} src={s.url} defer />)}
      </head>
      <body>
        <div style={{isolation: 'isolate'}}>
          <main>
            <article className={classNames(typographyStyles['spectrum-Typography'], {[docStyles.inCategory]: !!currentPage.category})}>
              <MDXProvider components={mdxComponents}>
                {children}
              </MDXProvider>
            </article>
          </main>
        </div>
      </body>
    </html>
  );
}

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

import ChevronLeft from '@spectrum-icons/ui/ChevronLeftLarge';
import classNames from 'classnames';
import {Divider} from '@react-spectrum/divider';
import docStyles from './docs.css';
import {getAnchorProps} from './utils';
import heroImage from 'url:../pages/assets/ReactSpectrumHome_Mobile_976x1025_2x.png';
import highlightCss from './syntax-highlight.css';
import {ImageContext} from './Image';
import {LinkProvider} from './types';
import linkStyle from '@adobe/spectrum-css-temp/components/link/vars.css';
import {MDXProvider} from '@mdx-js/react';
import React from 'react';
import ruleStyles from '@adobe/spectrum-css-temp/components/rule/vars.css';
import sideNavStyles from '@adobe/spectrum-css-temp/components/sidenav/vars.css';
import {theme} from '@react-spectrum/theme-default';
import {ToC} from './ToC';
import typographyStyles from '@adobe/spectrum-css-temp/components/typography/vars.css';

const TLD = 'react-spectrum.adobe.com';

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

function dirToTitle(dir) {
  return dir
    .split('/')[0]
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function Page({children, currentPage, publicUrl, styles, scripts}) {
  let isSubpage = currentPage.name.split('/').length > 1 && !/index\.html$/.test(currentPage.name);
  let pageSection = isSubpage ? dirToTitle(currentPage.name) : 'React Spectrum';
  let keywords = [...new Set(currentPage.keywords.concat([currentPage.category, currentPage.title, pageSection]).filter(k => !!k))];
  let description = currentPage.description || `Documentation for ${currentPage.title} in the ${pageSection} package.`;
  let title = currentPage.title + (!/index\.html$/.test(currentPage.name) ? ` - ${pageSection}` : '');
  return (
    <html
      lang="en-US"
      dir="ltr"
      prefix="og: http://ogp.me/ns#"
      className={classNames(
        theme.global.spectrum,
        theme.light['spectrum--light'],
        theme.medium['spectrum--medium'],
        typographyStyles.spectrum,
        docStyles.provider,
        highlightCss.spectrum)}>
      <head>
        <title>{title}</title>
        <meta charset="utf-8" />
        {styles.map(s => <link rel="stylesheet" href={s.url} />)}
        {scripts.map(s => <script type={s.type} src={s.url} defer />)}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

const CATEGORY_ORDER = [
  'Introduction',
  'Concepts',
  'Application',
  'Interactions',
  'Layout',
  '...',
  'Content',
  'Internationalization',
  'Utilities'
];

function Nav({currentPageName, pages}) {
  let isIndex = /index\.html$/;
  let currentParts = currentPageName.split('/');
  let currentDir = currentParts[0];

  pages = pages.filter(p => {
    let pageParts = p.name.split('/');
    let pageDir = pageParts[0];

    // Skip the error page, its only used for 404s
    if (p.name === 'error.html') {
      return false;
    }

    // Pages within same directory (react-spectrum/Alert.html)
    if (currentParts.length > 1) {
      return currentDir === pageDir && !isIndex.test(p.name);
    }

    // Top-level index pages (react-spectrum/index.html)
    if (currentParts.length === 1 && pageParts.length > 1 && isIndex.test(p.name)) {
      return true;
    }

    // Other top-level pages
    return !isIndex.test(p.name) && pageParts.length === 1;
  });

  if (currentParts.length === 1) {
    pages.push({
      category: 'Spectrum Ecosystem',
      name: 'spectrum-design',
      title: 'Spectrum Design',
      url: 'https://spectrum.adobe.com'
    });
    pages.push({
      category: 'Spectrum Ecosystem',
      name: 'spectrum-css',
      title: 'Spectrum CSS',
      url: 'https://opensource.adobe.com/spectrum-css/'
    });
  }

  // Key by category
  let pageMap = {};
  let rootPages = [];
  pages.forEach(p => {
    let cat = p.category;
    if (cat) {
      if (cat in pageMap) {
        pageMap[cat].push(p);
      } else {
        pageMap[cat] = [p];
      }
    } else {
      rootPages.push(p);
    }
  });

  // Order categories so specific ones come first, then all the others in sorted order.
  let categories = [];
  for (let category of CATEGORY_ORDER) {
    if (pageMap[category]) {
      categories.push(category);
    } else if (category === '...') {
      for (let category of Object.keys(pageMap).sort()) {
        if (!CATEGORY_ORDER.includes(category)) {
          categories.push(category);
        }
      }
    }
  }

  let title = currentParts.length > 1 ? dirToTitle(currentPageName) : 'React Spectrum';
  let currentPageIsIndex = isIndex.test(currentPageName);

  function SideNavItem({name, url, title}) {
    const isCurrentPage = !currentPageIsIndex && name === currentPageName;
    return (
      <li className={classNames(sideNavStyles['spectrum-SideNav-item'], {[sideNavStyles['is-selected']]: isCurrentPage})}>
        <a
          className={classNames(sideNavStyles['spectrum-SideNav-itemLink'], docStyles.sideNavItem)}
          href={url}
          aria-current={isCurrentPage ? 'page' : null}
          {...getAnchorProps(url)}>{title}</a>
      </li>
    );
  }

  return (
    <nav className={docStyles.nav}>
      <header>
        {currentParts.length > 1 &&
          <a href="../index.html" className={docStyles.backBtn}>
            <ChevronLeft aria-label="Back" />
          </a>
        }
        <a href="./index.html" className={docStyles.homeBtn}>
          <svg viewBox="0 0 30 26" fill="#E1251B" aria-label="Adobe">
            <polygon points="19,0 30,0 30,26" />
            <polygon points="11.1,0 0,0 0,26" />
            <polygon points="15,9.6 22.1,26 17.5,26 15.4,20.8 10.2,20.8" />
          </svg>
          <h2 className={typographyStyles['spectrum-Heading4']}>
            {title}
          </h2>
        </a>
      </header>
      <ul className={sideNavStyles['spectrum-SideNav']}>
        {rootPages.map(p => <SideNavItem {...p} />)}
        {categories.map(key => {
          const headingId = `${key.trim().toLowerCase().replace(/\s+/g, '-')}-heading`;
          return (
            <li className={sideNavStyles['spectrum-SideNav-item']}>
              <h3 className={sideNavStyles['spectrum-SideNav-heading']} id={headingId}>{key}</h3>
              <ul className={sideNavStyles['spectrum-SideNav']} aria-labelledby={headingId}>
                {pageMap[key].sort((a, b) => a.title < b.title ? -1 : 1).map(p => <SideNavItem {...p} />)}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={docStyles.pageFooter}>
      <hr className={classNames(ruleStyles['spectrum-Rule'], ruleStyles['spectrum-Rule--small'], ruleStyles['spectrum-Rule--horizontal'])} />
      <ul>
        <li>Copyright © {year} Adobe. All rights reserved.</li>
        <li><a className={classNames(linkStyle['spectrum-Link'], linkStyle['spectrum-Link--secondary'], docStyles.link)} href="//www.adobe.com/privacy.html">Privacy</a></li>
        <li><a className={classNames(linkStyle['spectrum-Link'], linkStyle['spectrum-Link--secondary'], docStyles.link)} href="//www.adobe.com/legal/terms.html">Terms of Use</a></li>
        <li><a className={classNames(linkStyle['spectrum-Link'], linkStyle['spectrum-Link--secondary'], docStyles.link)} href="//www.adobe.com/privacy/cookies.html">Cookies</a></li>
        <li><a className={classNames(linkStyle['spectrum-Link'], linkStyle['spectrum-Link--secondary'], docStyles.link)} href="//www.adobe.com/privacy/ca-rights.html">Do not sell my personal information</a></li>
      </ul>
    </footer>
  );
}

export function Layout({scripts, styles, pages, currentPage, publicUrl, children, toc}) {

  return (
    <Page scripts={scripts} styles={styles} publicUrl={publicUrl} currentPage={currentPage}>
      <div style={{isolation: 'isolate'}}>
        <header className={docStyles.pageHeader} />
        <Nav currentPageName={currentPage.name} pages={pages} />
        <main>
          <article className={classNames(typographyStyles['spectrum-Typography'], {[docStyles.inCategory]: !!currentPage.category})}>
            <MDXProvider components={mdxComponents}>
              <ImageContext.Provider value={publicUrl}>
                <LinkProvider>{children}</LinkProvider>
              </ImageContext.Provider>
            </MDXProvider>
          </article>
          {toc.length ? <ToC toc={toc} /> : null}
          <Footer />
        </main>
      </div>
    </Page>
  );
}

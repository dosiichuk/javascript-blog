{
  ('use strict');
  const templates = {
    authorName: Handlebars.compile(document.querySelector('#template-author-name').innerHTML),
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-cloud-link').innerHTML),
  };

  const opts = {
    tagSizes: {
      count: 5,
      classPrefix: 'tag-size-',
    },
  };
  const select = {
    all: {
      articles: '.post',
      linksTo: {
        tags: 'a[href^="#tag-"]',
        authors: 'a[href^="#author-"]',
      },
    },
    article: {
      tags: '.post-tags .list',
      author: '.post-author',
      title: '.post-title',
    },
    listOf: {
      titles: '.titles',
      tags: '.tags.list',
      authors: '.list.authors',
    },
    active: {
      articles: '.post.active',
      titleLinks: '.titles a.active',
      tags: 'a.active[href^="#tag-"]',
      authorLinks: 'a.active[href^="#author-"]',
    },
    links: {
      titles: '.titles a',
      tags: '.post-tags ul li a',
      sidebar: '.list.tags a',
      authors: '.list.authors a',
    }
  };


  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll(select.active.titleLinks);
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll(select.active.articles);
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const linkIdentifier = clickedElement.getAttribute('href');

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const selectedArticle = document.querySelector(linkIdentifier);

    /* [DONE] add class 'active' to the correct article */
    selectedArticle.classList.add('active');
  };

  const generateTitleLinks = function (customSelector = '') {
    /* remove contents of titleList */
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';
    const articles = Array.from(document.querySelectorAll(select.all.articles.trim() + customSelector));
    /* create HTML of the links */
    const markup = articles
      .map(
        (article) => {
          const linkHTMLData = {id: article.getAttribute('id'), title: article.querySelector(select.article.title).innerText};
          return templates.articleLink(linkHTMLData);
        }
      )
      .join('');
    /* insert links into titleList */
    titleList.innerHTML = markup;
    // add event listeners to JS-generated links
    const links = document.querySelectorAll(select.links.titles);

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };

  const calculateTagsParams = function(tags) {
    const max = Math.max(...Object.values(tags));
    const min = Math.min(...Object.values(tags));
    return {min, max};
  };

  const calculateTagClass = function(count, params) {
    const interval = (params.max - params.min) / opts.tagSizes.count;
    const classOrd = Math.round((count - params.min)/interval);
    if (count === params.min) return `${opts.tagSizes.classPrefix}1`;
    return `${opts.tagSizes.classPrefix}${classOrd}`;
  };

  const generateTags = function() {
    /* [NEW] create a new variable allTags with an empty array */
    let allTags = {};
    /* find all articles */
    const articles = Array.from(document.querySelectorAll(select.all.articles));
    /* START LOOP: for every article: */

    articles.forEach((article) => {
      /* find tags wrapper */
      const tagWrapper = article.querySelector(select.article.tags);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      /* split tags into array */
      const tags = article.getAttribute('data-tags').split(' ');
      /* START LOOP: for each tag */
      tags.forEach(tag => {
        /* generate HTML of the link */
        const tagHTMLData = { tag };
        const linkHtml = templates.tagLink(tagHTMLData);
        /* add generated code to html variable */
        html += linkHtml;
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]){
          /* [NEW] add generated code to allTags array */
          allTags[tag] = 1;
        } else {
          allTags[tag] ++;
        }
      });
      /* END LOOP: for each tag */
      /* insert HTML of all the links into the tags wrapper */
      tagWrapper.insertAdjacentHTML('afterbegin', html);
    });
    /* END LOOP: for every article: */
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(select.listOf.tags);
    /* [NEW] add html from allTags to tagList */
    const tagsParams = calculateTagsParams(allTags);
    /* [NEW] create variable for all links HTML code */
    const allTagsData = {tags: []};
    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allTagsData.tags.push({
        tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  };

  const tagClickHandler = function(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll(select.active.tags);
    /* START LOOP: for each active tag link */
    /* remove class active */
    activeTagLinks.forEach(link => link.classList.remove('active'));
    /* END LOOP: for each active tag link */
    /* find all tag links with "href" attribute equal to the "href" constant */
    const foundLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    /* add class active */
    foundLinks.forEach(link => link.classList.add('active'));
    /* END LOOP: for each found tag link */
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function (){
    /* find all links to tags */
    const tagLinks = Array.from(document.querySelectorAll(select.links.tags));
    const sideLinks = Array.from(document.querySelectorAll(select.links.sidebar));
    /* START LOOP: for each link */
    /* add tagClickHandler as event listener for that link */
    tagLinks.forEach(link => link.addEventListener('click', tagClickHandler));
    sideLinks.forEach(link => link.addEventListener('click', tagClickHandler));
  /* END LOOP: for each link */
  };

  const generateAuthors = function(){
    const articles = Array.from(document.querySelectorAll(select.all.articles));
    //add author names to each article
    let authorNames = {};
    articles.forEach(article => {
      const author = article.getAttribute('data-author');
      const authorData = {name: author};
      const authorHTML = templates.authorName(authorData);
      const authorElement = article.querySelector(select.article.author);
      authorElement.innerHTML = authorHTML;
      if (!authorNames[author]) {
        authorNames[author] = 1;
      } else {
        authorNames[author] ++;
      }
    });
    const authorLinkData = {authors: []};
    Object.keys(authorNames).forEach(name => {
      authorLinkData.authors.push({
        nameHash: name.split(' ').join('-'),
        name,
        postCount: authorNames[name],
      });
    });
    const authorNameWrapper = document.querySelector(select.listOf.authors);
    authorNameWrapper.innerHTML = templates.authorLink(authorLinkData);
  };

  const authorClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = clickedElement.innerText.trim();
    const activeAuthorLinks = document.querySelectorAll(select.active.authorLinks);
    activeAuthorLinks.forEach(link => link.classList.remove('active'));
    const foundLinks = document.querySelectorAll('a[href="' + href + '"]');
    foundLinks.forEach(link => link.classList.add('active'));
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const addClickListenersToAuthors = function (){
    /* find all links to authors */
    const authorLinks = Array.from(document.querySelectorAll(select.links.authors));
    /* START LOOP: for each link */
    /* add authorClickHandler as event listener for that link */
    authorLinks.forEach(link => link.addEventListener('click', authorClickHandler));
    /* END LOOP: for each link */
  };


  generateTitleLinks();
  generateTags();
  addClickListenersToTags();
  generateAuthors();
  addClickListenersToAuthors();
}








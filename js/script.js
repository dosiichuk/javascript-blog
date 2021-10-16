{
  ('use strict');
  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post .post-author';

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.post.active');
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
    const titleList = document.querySelector(optTitleListSelector );
    titleList.innerHTML = '';
    const articles = Array.from(document.querySelectorAll(optArticleSelector + customSelector));
    /* create HTML of the links */
    const markup = articles
      .map(
        (article) =>
          `<li><a href="#${article.getAttribute('id')}"><span>${
            article.querySelector(optTitleSelector).innerText
          }</span></a></li>`
      )
      .join('');
    /* insert links into titleList */
    titleList.innerHTML = markup;
    // add event listeners to JS-generated links
    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };
  const generateTags = function() {
    /* find all articles */
    const articles = Array.from(document.querySelectorAll('.post'));
    /* START LOOP: for every article: */

    articles.forEach((article)=> {
      /* find tags wrapper */
      const tagWrapper = article.querySelector(optArticleTagsSelector);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      /* split tags into array */
      const tags = article.getAttribute('data-tags').split(' ');
      /* START LOOP: for each tag */
      tags.forEach(tag=> {
        /* generate HTML of the link */
        const linkHtml = `<li><a href="#tag-${tag}">${tag}</a></li>`;
        /* add generated code to html variable */
        html += linkHtml;
      });
      /* END LOOP: for each tag */
      /* insert HTML of all the links into the tags wrapper */
      tagWrapper.insertAdjacentHTML('afterbegin', html);
    });
    /* END LOOP: for every article: */
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
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    /* remove class active */
    activeTagLinks.forEach(link=> link.classList.remove('active'));
    /* END LOOP: for each active tag link */
    /* find all tag links with "href" attribute equal to the "href" constant */
    const foundLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    /* add class active */
    foundLinks.forEach(link=> link.classList.add('active'));
    /* END LOOP: for each found tag link */
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function (){
    /* find all links to tags */
    const tagLinks = Array.from(document.querySelectorAll('.post-tags ul li a'));
    /* START LOOP: for each link */
    /* add tagClickHandler as event listener for that link */
    tagLinks.forEach(link=> link.addEventListener('click', tagClickHandler));
  /* END LOOP: for each link */
  };

  const generateAuthors = function(){
    const articles = Array.from(document.querySelectorAll('.post'));
    //add author names to each article
    let authorNames = [];
    articles.forEach(article=> {
      const author = article.getAttribute('data-author');
      const authorElement = article.querySelector(optArticleAuthorSelector);
      authorElement.innerText = author;
      authorNames.push(author);
    });
    authorNames = new Set(authorNames);
    let html = '';
    authorNames.forEach(name=> {
      html += `<li>
                  <a href="#author-${name.split(' ').join('-')}" class="author-link">
                    <span class="author-name">${name}</span>
                  </a>
                </li>`;
    });
    const authorNameWrapper = document.querySelector('.list.authors');
    authorNameWrapper.insertAdjacentHTML('afterbegin', html);
  };

  const authorClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = clickedElement.innerText;
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    activeAuthorLinks.forEach(link=> link.classList.remove('active'));
    const foundLinks = document.querySelectorAll('a[href="' + href + '"]');
    foundLinks.forEach(link=> link.classList.add('active'));
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const addClickListenersToAuthors = function (){
    /* find all links to authors */
    const authorLinks = Array.from(document.querySelectorAll('.list.authors a'));
    /* START LOOP: for each link */
    /* add authorClickHandler as event listener for that link */
    authorLinks.forEach(link=> link.addEventListener('click', authorClickHandler));
    /* END LOOP: for each link */
  };


  generateTitleLinks();
  generateTags();
  addClickListenersToTags();
  generateAuthors();
  addClickListenersToAuthors();
}








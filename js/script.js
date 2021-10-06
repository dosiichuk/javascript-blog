{
  ("use strict");
  const optArticleSelector = ".post",
    optTitleSelector = ".post-title",
    optTitleListSelector = ".titles";

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    //   console.log(event.target);

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll(".titles a.active");
    for (let activeLink of activeLinks) {
      activeLink.classList.remove("active");
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add("active");
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll(".post.active");
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove("active");
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const linkIdentifier = clickedElement.getAttribute("href");

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const selectedArticle = document.querySelector(linkIdentifier);

    /* [DONE] add class 'active' to the correct article */
    selectedArticle.classList.add("active");
  };

  const generateTitleLinks = function () {
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = "";
    const articles = Array.from(document.querySelectorAll(optArticleSelector));
    /* create HTML of the links */
    const markup = articles
      .map(
        (article) =>
          `<li><a href="#${article.getAttribute("id")}"><span>${
            article.querySelector(optTitleSelector).innerText
          }</span></a></li>`
      )
      .join("");
    /* insert links into titleList */
    titleList.innerHTML = markup;
    // add event listeners to JS-generated links
    const links = document.querySelectorAll(".titles a");

    for (let link of links) {
      link.addEventListener("click", titleClickHandler);
    }
  };
  generateTitleLinks();
}

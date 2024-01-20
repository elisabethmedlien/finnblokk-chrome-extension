chrome.storage.sync.get(['list'], function(result) {
  const list = result.list || [];
  const articles = Array.from(document.querySelectorAll('article'))
  const firstChildOfArticle = articles.map(article => article.firstElementChild).map(firstChild => firstChild)
  const finnkoder = firstChildOfArticle.map(firstChild => firstChild.getAttribute('aria-owns').split('-')[2])

  const commonElements = finnkoder.filter(element => list.includes(element));

  if (commonElements) {
    if (DEBUG) console.log("CONTENT.JS: Det finnes "+commonElements.length+" blokkerte finnkoder i listen.");

    if (articles) {
      articles.forEach(article => {
        const firstChild = article.firstElementChild
        const finnkode = firstChild.getAttribute('aria-owns').split('-')[2]
        if (commonElements.includes(finnkode)) {
          article.style = " background-color: #F44336; color: white; border: none; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;"
          article.innerHTML = 'Blokkert annonse: ' + finnkode
          article.addEventListener('click', function() {
            window.location.href = "https://www.finn.no/realestate/homes/ad.html?finnkode=" + finnkode
        });
        } 
      })
    }
  } else {
    if (DEBUG) console.log("CONTENT.JS: Det er ingen blokkerte finnkoder i listen.");
  }
});


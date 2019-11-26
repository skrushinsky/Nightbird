function showSection(sectionName) {
    const elem = document.getElementById('section');
    elem.setAttribute('w3-include-html', `/inc/${sectionName.toLowerCase()}.html`);
    w3.includeHTML();

    const navBar = document.getElementsByTagName('nav')[0];
    const xPath = `//a[contains(text(),'${sectionName}')]`;
    const iter = document.evaluate(xPath, navBar, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    try {
      let node = iterator.iterateNext();
      while (node) {
        console.debug( node.textContent );
        node = iterator.iterateNext();
      }
    }
    catch (e) {
      console.error();( 'Error: Document tree modified during iteration ' + e );
    }

}

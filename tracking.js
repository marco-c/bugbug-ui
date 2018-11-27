async function get_tracking_data() {
  let response = await fetch('https://index.taskcluster.net/v1/task/project.releng.services.project.testing.bugbug_eval.latest/artifacts/public/tracking.json');
  return await response.json();
}

async function get_titles(ids) {
  let response = await fetch(`https://bugzilla.mozilla.org/rest/bug?id=${ids.join(',')}&include_fields=summary`);
  let data = await response.json();
  let titles = [];
  for (let elem of data['bugs']) {
    titles.push(elem['summary']);
  }
  return titles;
}

async function go() {
  await new Promise(function(resolve, reject) {
    window.onload = resolve;
  });

  let ids = await get_tracking_data();

  let titles = await get_titles(ids);

  let bugs = [];
  for (let i = 0; i < ids.length; i++) {
    bugs.push({
      'id': ids[i],
      'title': titles[i],
    });
  }

  let table = document.getElementById('table');

  for (let bug of bugs) {
    let row = table.insertRow(table.rows.length);

    let id = row.insertCell(0);
    let link = document.createElement('a');
    link.textContent = bug['id']
    link.href = `https://bugzilla.mozilla.org/show_bug.cgi?id=${bug['id']}`;
    link.target = '_blank';
    id.appendChild(link);

    let title = row.insertCell(1);
    title.appendChild(document.createTextNode(bug['title']));
  }
}

go();



document.addEventListener('DOMContentLoaded', ()=> {
  // autosuggest (very lightweight)
  const qInput = document.getElementById('qInput');
  if(qInput){
    let timer;
    qInput.addEventListener('input', e => {
      clearTimeout(timer);
      timer = setTimeout(()=> {
        const q = qInput.value.trim();
        if(!q) { document.getElementById('suggestions').innerHTML = ''; return; }
        fetch('/api/suggest?q=' + encodeURIComponent(q))
          .then(r => r.json())
          .then(list => {
            const html = list.slice(0,6).map(i => `<button class="btn btn-sm btn-light m-1 suggestion">${i}</button>`).join('');
            document.getElementById('suggestions').innerHTML = html;
            document.querySelectorAll('.suggestion').forEach(btn => btn.addEventListener('click', ()=> {
              qInput.value = btn.textContent; document.getElementById('searchForm').submit();
            }));
          });
      }, 300);
    });
  }

  // Bookmark button (AJAX)
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = btn.dataset.job;
      fetch('/bookmark/' + id, { method: 'POST' })
        .then(r => r.json())
        .then(res => {
          if(res.ok) {
            btn.textContent = '★';
            Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Saved' });
          } else {
            Swal.fire('Login required', '', 'warning');
          }
        });
    });
  });

  // Load more (AJAX stub)
  const loadMore = document.getElementById('loadMore');
  if(loadMore){
    loadMore.addEventListener('click', ()=> {
      loadMore.disabled = true;
      loadMore.textContent = 'Loading...';
      // placeholder: actual implementation should call /api/jobs?offset=...
      setTimeout(()=> {
        loadMore.disabled = false; loadMore.textContent = 'Load more';
        Swal.fire({ position:'center', icon:'info', title:'Demo: load more would fetch more jobs via AJAX', showConfirmButton:false, timer:1200 });
      }, 600);
    });
  }

  // Apply Now (opens a SweetAlert modal with small form)
  const applyBtn = document.getElementById('applyNow');
  if(applyBtn){
    applyBtn.addEventListener('click', ()=> {
      const jobId = applyBtn.dataset.job;
      Swal.fire({
        title: 'Apply for this job',
        html:
          '<input id="sw-name" class="swal2-input" placeholder="Full name">' +
          '<input id="sw-email" class="swal2-input" placeholder="Email">' +
          '<input id="sw-phone" class="swal2-input" placeholder="Phone (optional)">' +
          '<textarea id="sw-cover" class="swal2-textarea" placeholder="Short message"></textarea>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          const name = document.getElementById('sw-name').value;
          const email = document.getElementById('sw-email').value;
          const phone = document.getElementById('sw-phone').value;
          const cover = document.getElementById('sw-cover').value;
          if(!name || !email) { Swal.showValidationMessage('Name and email required'); return false; }
          // Submit via fetch to a small JSON endpoint (server must accept JSON)
          return fetch('/api/apply_json', {
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ job_id: jobId, name, email, phone, cover })
          }).then(r => r.json());
        }
      }).then((result) => {
        if(result.isConfirmed) {
          Swal.fire({ icon: result.value.ok ? 'success' : 'error', title: result.value.ok ? 'Application sent' : 'Error' });
        }
      });
    });
  }
});

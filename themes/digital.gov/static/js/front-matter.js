jQuery(document).ready(function($) {


function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function get_file_name(){
  var edit = getParameterByName('edit');
  var edit = edit.replace(root_url, ''); // remove the baseURL (e.g https://digitalgov.gov/
  var edit = edit.replace(/\/$/, '') + '.md'; // remove the trailing slash
  var edit = edit.replace(/\//g, '-');
  return filename;
}

function get_year_month(){
  var edit = getParameterByName('edit');
  var edit = edit.replace(root_url, ''); // remove the baseURL (e.g https://digitalgov.gov/
  var year_month = edit.match(/(\d{4})(?:\/(\d{2}))/);
  return year_month;
}

function get_github_file(filename, year_month){
  var path = 'https://api.github.com/repos/GSA/digitalgov.gov/contents/content/posts/'+year_month[0]+'/'+filename;
  console.log(path);
  return path;
}

var filename = get_file_name();
var year_month = get_year_month();
var github_path = get_github_file(filename, year_month);

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}



$.ajax({
  url: github_path,
  dataType: 'jsonp',
  success: function(results) {
    var content = Base64.decode(results.data.content);
    // console.log(content);
    $('.matter-body pre').text(content);
  }
});




  // Step 1. Add into this string the characters to look for
  var entityPattern = /[&<>"'`)(=+:*@.?$%\/]/g;
  // Step 2. Add a new line that contains the HTML character and the entity that you want it transformed into
  // Reference: https://dev.w3.org/html5/html-author/charref
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
    '*': '&#42;',
    '$': '&#36;',
    '%': '&#37;',
    ':': '&#58;',
    '.': '&#46;',
    '(': '&#40;',
    ')': '&#41;',
    '+': '&#43;',
    '@': '&#64;',
    '?': '&#63;'
  };

  // The small words we are removing from the filenames and URLs
  var small_words = /and |the |are |is |of |to |a /gi; // these are the small words we are removing from urls



  //- - - - - - - - - - - - - - - - - - - -

  // // Post type Buttons
  // $(".post_types .btn").click(function() {
  //   $(".post_types .btn").removeClass('selected');
  //   $(this).addClass('selected');
  //   get_matter_data();
  //   get_event_type();
  // });

  // // Gets post type from buttons
  function get_post_type(){
    // var post_type = $( '.post_types .selected' ).attr( 'data-type' );
    var parts = location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    var post_type = lastSegment.replace('new-', '');
    var d = $(".post_types .btn[data-type='"+post_type+"']").addClass('selected');
    return post_type;
  }
  get_post_type();


  // Gets today's date + time
  function curr_date(){
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var output = d.getFullYear() + '-' +
        (month<10 ? '0' : '') + month + '-' +
        (day<10 ? '0' : '') + day + ' ' +
        d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() +
        ' -0400';
    return output;
  }

  // inputs the current date in the date field
  $('input[name="m_date"]').val(curr_date());
  $('input[name="m_start_date"]').val(curr_date());
  $('input[name="m_end_date"]').val(curr_date());


  // Gets the data from the FORM and pushes it to print_matter()
  function get_matter_data(){
    var data = {};
    $('#matter-maker').serializeArray().map(function(x){
      data[x.name] = x.value;
    });
    setTimeout(function() {
      print_matter(data);
    }, 400);
  }

  // This watches for any keyup events (typing) in the form fields
  $( "#matter-maker .fm" ).keyup(function( event ) {
    get_matter_data();
  });


  // function show_fields(d){
  //   $('#matter-maker label').addClass('hidden');
  //   $('#matter-maker .block').addClass('hidden');
  //   var fields = d.split(', ');
  //   for (var f in fields) {
  //     var field = '.'+fields[f];
  //     $('#matter-maker '+field).removeClass('hidden');
  //   }
  // }
  // show_fields('m_date, m_title, m_summary, m_authors, m_categories, m_tag');

  // A function that replaces out the special characters in strings
  function escapeHtml (string) {
    return String(string).replace(entityPattern, function (s) {
      return entityMap[s];
    });
  }

  // Makes the filename
  function filename(d,t) {
    var date = d.match(/^[^\s]+/);
    t = t.replace(small_words, '');
    t = t.replace(entityPattern, ' ').trim();
    t = t.replace(/\s+/g,' ').trim();
    var slug = t.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    var filename = date[0]+'-'+slug+'.md';
    return filename;
  }

  // Makes the URL
  function matter_url(d,t) {
    var date = d.match(/^[^\s]+/);
    date = date[0].replace(/-/g, '/');
    t = t.replace(small_words, '');
    t = t.replace(entityPattern, ' ').trim();
    t = t.replace(/\s+/g,' ').trim();
    var slug = t.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    var f = '/'+date+'/'+slug;
    return f;
  }

  // Makes lists in the front matter
  function list_items(d) {
    var list = d.split(',');
    $item = '';
    $item += '\n';
    $.each( list, function( key, value ) {
      slug = value.replace(entityPattern, ' ').trim();
      slug = slug.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      $item += '  - ' + $.trim(slug) + '\n';
    });
    return $item;
  }

  // Builds Venue Data
  function build_venue_data(d) {
    $item = '';
    $item += '\n';
    $.each( d, function( key, value ) {
      $item += '  ' + key + ': ' + $.trim(value) + '\n';
    });
    return $item;
  }


  function set_1800f(set){
    if (set == true) {
      $('.m_venue_name input').val('The General Services Administration').prop("readonly", true).addClass('quiet');
      $('.m_address input').val('1800 F St.').prop("readonly", true).addClass('quiet');
      $('.m_city input').val('Washington').prop("readonly", true).addClass('quiet');
      $('.m_state input').val('D.C.').prop("readonly", true).addClass('quiet');
      $('.m_zip input').val('20006').prop("readonly", true).addClass('quiet');
      $('.m_country input').val('USA').prop("readonly", true).addClass('quiet');
      $('.m_map input').val('https://goo.gl/maps/bFWBD6QfDLA2').prop("readonly", true).addClass('quiet');
      get_matter_data();
    } else {
      $('.venue-block input').prop("readonly", false).removeClass('quiet');
      $('.m_venue_name input').val('');
      $('.m_address input').val('');
      $('.m_city input').val('');
      $('.m_state input').val('');
      $('.m_zip input').val('');
      $('.m_country input').val('');
      $('.m_map input').val('');
      get_matter_data();
    }
  }

  $('.m_1800f input').click(function(){
    if (this.checked) {
      set_1800f(true);
    } else {
      set_1800f(false);
    }
  });


  // Event type Buttons
  $(".event_types .btn").click(function() {
    $(".event_types .btn").removeClass('selected');
    $(this).addClass('selected');
    get_matter_data();
  });

  function get_event_type(){
    var event_type = $( '.event_types .selected' ).attr( 'data-type' );
    if (event_type == 'online') {
      $('.m_youtube').removeClass('hide');
      $('.venue-block').addClass('hide');
    } else if (event_type == 'mixed') {
      $('.m_youtube').removeClass('hide');
      $('.venue-block').removeClass('hide');
    } else {
      $('.m_youtube').addClass('hide');
      $('.venue-block').removeClass('hide');
    }
    return event_type;
  }



  // Prints the front-matter in a DIV on the page
  function print_matter(data){
    var post_type = get_post_type(); // gets the post type

    // Checks to see what the post type is and prints the front-matter for each type
    // POST
    if (post_type == 'post') {
      // show_fields('m_date, m_title, m_summary, m_authors, m_categories, m_tag');
      var matter = [
        "---",
          "url: " + matter_url(data['m_date'], data['m_title']),
          "date: " + data['m_date'],
          "title: '" + escapeHtml(data['m_title']) + "'",
          "summary: '" + escapeHtml(data['m_summary']) + "'",
          "authors: " + list_items(data['m_authors']),
          "categories: " + list_items(data['m_categories']),
          "tag: " + list_items(data['m_tag']),
        "---",
        ,
        "***Paste content here. Delete this line***"
      ].join("\n");
      var body = encodeURIComponent(matter);
      var newfile = 'https://github.com/GSA/digitalgov.gov/new/demo/content/posts/draft?filename='+filename(data['m_date'], data['m_title'])+'&value='+body;

      // DOC
    } else if (post_type == 'doc') {
      // show_fields('m_date, m_title, m_summary');
      var matter = [
        "---",
          "url: " + matter_url(data['m_date'], data['m_title']),
          "date: " + data['m_date'],
          "title: '" + escapeHtml(data['m_title']) + "'",
          "summary: '" + escapeHtml(data['m_summary']) + "'",
        "---",
        ,
        "***Paste content here. Delete this line***"
      ].join("\n");
      var body = encodeURIComponent(matter);
      var newfile = 'https://github.com/GSA/digitalgov.gov/new/demo/content/docs/draft?filename='+filename(data['m_date'], data['m_title'])+'&value='+body;

      // EVENT
    } else if (post_type == 'event') {
      var event_type = get_event_type();
      if (event_type == 'in-person' || event_type == 'mixed') {
        // show_fields('m_date, m_title, m_summary, m_authors, m_categories, m_tag, type-block, m_event_organizer, m_start_date, m_end_date, m_youtube, m_event_type, venue-block, m_1800f, m_venue_name, m_room, m_address, m_city, m_state, m_zip, m_country, m_map, m_registration_url, m_host');
        var venue_data = {'venue_name': data['m_venue_name'], 'room': data['m_room'], 'address': data['m_address'], 'city': data['m_city'], 'state': data['m_state'], 'zip': data['m_zip'], 'country': data['m_country'], 'map': data['m_map']}
        var matter = [
          "---",
            "url: " + matter_url(data['m_date'], data['m_title']),
            "date: " + data['m_date'],
            "title: '" + escapeHtml(data['m_title']) + "'",
            "summary: '" + escapeHtml(data['m_summary']) + "'",
            "authors: " + list_items(data['m_authors']),
            "categories: " + list_items(data['m_categories']),
            "tag: " + list_items(data['m_tag']),
            "event_type: " + event_type,
            "start_date: " + data['m_start_date'],
            "end_date: " + data['m_end_date'],
            "event_organizer: " + data['m_event_organizer'],
            "host: " + data['m_host'],
            "registration_url: " + data['m_registration_url'],
            "youtube: " + data['m_youtube'],
            "venue: " + build_venue_data(venue_data),
          "---",
          ,
          "***Paste content here. Delete this line***"
        ].join("\n");
      } else {
        // show_fields('m_date, m_title, m_summary, m_authors, m_categories, m_tag, type-block, m_event_organizer, m_start_date, m_end_date, m_youtube, m_event_type, m_registration_url, m_host');
        var matter = [
          "---",
            "url: " + matter_url(data['m_date'], data['m_title']),
            "date: " + data['m_date'],
            "title: '" + escapeHtml(data['m_title']) + "'",
            "summary: '" + escapeHtml(data['m_summary']) + "'",
            "authors: " + list_items(data['m_authors']),
            "categories: " + list_items(data['m_categories']),
            "tag: " + list_items(data['m_tag']),
            "event_type: " + event_type,
            "start_date: " + data['m_start_date'],
            "end_date: " + data['m_end_date'],
            "event_organizer: " + data['m_event_organizer'],
            "host: " + data['m_host'],
            "registration_url: " + data['m_registration_url'],
            "youtube: " + data['m_youtube'],
          "---",
          ,
          "***Paste content here. Delete this line***"
        ].join("\n");
      }

      var body = encodeURIComponent(matter);
      var newfile = 'https://github.com/GSA/digitalgov.gov/new/demo/content/events/draft?filename='+filename(data['m_date'], data['m_title'])+'&value='+body;
    }

    $('#post-matter').text(matter);
    $('#filename').text(filename(data['m_date'], data['m_title']));
    $('#newfile').attr('href', newfile);
  }

});

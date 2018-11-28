import Route from '@ember/routing/route';
import $ from 'jquery';

export default Route.extend({
  actions: {
    // This toggles the navbar to hide / show about content
    toggleNav: function () {
      $('#navbarHeader').toggleClass('collapse');
    }
   }
});

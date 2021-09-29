import { libWrapper } from './shim.js';

Hooks.once('ready', async function() {
    libWrapper.register('navigation-name', 'SceneNavigation.prototype.getData', expandedGetData, 'OVERRIDE');
});


function expandedGetData(options) {

    // Modify Scene data
    const scenes = this.scenes.map(scene => {
      let data = scene.data.toObject(false);
      let users = game.users.filter(u => u.active && (u.viewedScene === scene.id));
      let name = game.user.isGM ? data.name : data.navName
      if(name === "") name = data.name
      data.name = TextEditor.truncateText(name, {maxLength: 32});
	    data.users = users.map(u => { return {letter: u.name[0], color: u.data.color} });
	    data.visible = (game.user.isGM || scene.isOwner || scene.active);
	    data.css = [
	      scene.isView ? "view" : null,
        scene.active ? "active" : null,
        data.permission.default === 0 ? "gm" : null
      ].filter(c => !!c).join(" ");
	    return data;
    });

    // Return data for rendering
    return {
      collapsed: this._collapsed,
      scenes: scenes
    }
  }
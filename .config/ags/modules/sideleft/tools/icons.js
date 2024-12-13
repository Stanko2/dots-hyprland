const { Gtk, GLib } = imports.gi;
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
const { execAsync, exec } = Utils;
const { Box, Button, EventBox, Icon, Label, Scrollable, Revealer, Grid, Entry } = Widget;
import SidebarModule from './module.js';
import { MaterialIcon } from '../../.commonwidgets/materialicon.js';
import { setupCursorHover } from '../../.widgetutils/cursorhover.js';
import data from './icons_data.js';

const ICONS_PER_ROW = 9;

function getIcons(data) {

  const boxes = [];
  for (let i = 0; i < data.length; i += ICONS_PER_ROW) {
    const row = Box({
      homogeneous: true,
      hexpand: true,
      hpack: 'fill',
      className: 'sidebar-icon-row spacing-h-10',
      children: data.slice(i, i + ICONS_PER_ROW).map(icon => {
        return EventBox({
          onPrimaryClick: () => {
            execAsync(`wl-copy ${icon.name}`).catch(print);
          },
          onSecondaryClick: () => {
            execAsync(`wl-copy "<span class=\"material-symbols-outlined\">${icon.name}</span>"`).catch(print);
          },
          setup: setupCursorHover,
          tooltipText: icon.name,
          child: MaterialIcon(icon.name, 'massive'),
        });
      })
    })
    boxes.push(row);
  }

  return boxes;
}



export default () => SidebarModule({
  icon: MaterialIcon('code', 'norm'),
  name: 'Icon selection',
  child: Box({
    hexpand: true,
    child: Box({
      vertical: true,
      className: 'spacing-v-5',
      children: [
        Entry({
          placeholder_text: 'Search icons',
          className: 'sidebar-icons-search txt-norm',
          visibility: true,
          onAccept: (self) => {
            const text = self.text.toLowerCase();
            const filtered = data.icons.filter(icon => (icon.name.includes(text) || icon.tags.some(tag => tag.includes(text))));
            self.parent.children[1].children = getIcons(filtered);
          }
        }),
        Box({
          className: 'spacing-h-5 txt',
          vertical: true,
          children: getIcons(data.icons)
        })]
    })
  })
});

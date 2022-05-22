import 'regenerator-runtime/runtime';
import m from 'mithril';
import ref from './ref'
import temuan from './temuan'
import rekomendasi from './rekomendasi';

 

const main = {


    onupdate: ref.paint,
    view: () => {
        return m('div', m("button", { "class": "button is-success", "onclick": temuan.Baru }, "Temuan Baru"), ref.recBttn,
            m('div', ref.makeModal("form")),
            m('div', ref.tableComp))


    }
}

 
m.mount(document.getElementById('main'), main);

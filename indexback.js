import 'regenerator-runtime/runtime';
import m from 'mithril';

var tss = Math.floor(Date.now() / 1000)
var genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function ObjectID() {
    this.id = tss.toString(16) + genRanHex(16)
}

var ref = {
    tableComp: null,
    newTemuanallowed: false,
    newReccAllowed: false,
    state: {},
    formId: null,
    recData: {},
    newTemuan: null,
    newRecc: null,
    tabId: "tabelUtama",

    makeModal: name => m('.modal',
        { class: ref.state[name] && 'is-active' },
        m('.modal-background'),
        m('.modal-content', ref.state[name]),
        m('.modal-close.is-large',
            {
                "aria-label": "close",
                onclick: () => [

                    ref.state[name] = null,
                    m.redraw(),
                ]
            })
    ),

    form: (schema, id, onSubmit) => {

        return m(".box",
            m("form",

                schema[0].id ? [

                    schema.map(sc => {
                        return m(".field",
                            m(".control",
                                m("input", { "id": sc.id, "class": "input is-primary", "type": sc.type, "placeholder": sc.ph, "value": sc.value, "disabled": sc.disabled, "min": "0", "max": "100" })
                            ))
                    })] : m(".field",
                        m(".control",
                            m("div", { "class": "select is-multiple" },
                                m("select", { "multiple": "multiple", "size": "8", "id": id },
                                    schema.map(sc => {
                                        return m("option", { "value": sc.kode },
                                            sc.desc)

                                    })
                                )))),
                m("div", { "class": "control" },
                    m("button", { "class": "button is-link", onclick: onSubmit },
                        "Submit"
                    ))))
    },

    temuanBaru: () => {

        var oid = new ObjectID

        ref.formId = oid.id
        var arrParam = [
            { id: "id", type: "text", ph: oid.id, value: oid.id, disabled: true },
            { id: "bobot", type: "number", ph: "BOBOT", value: 100, disabled: false },
            { id: "desc", type: "text", ph: "Uraian", value: "", disabled: false }
        ]
        var ids = arrParam.map(arr => arr.id)

        var onSubmit = () => {

            var temuan = {
                id: document.getElementById(ids[0]).value,
                bobot: document.getElementById(ids[1]).value,
                desc: document.getElementById(ids[2]).value
            }
            var exArray = ref.recData.temuan

            if (exArray == undefined) {
                var Obj = { temuan: [temuan] }
            } else {

                exArray.push(temuan)
                var Obj = { temuan: exArray }
            }

            Object.assign(ref.recData, Obj)

            ref.newTemuan = temuan
            ref.newTemuanallowed = true
            ref.state.temuan = null
            ref.formId = null

        }

        ref.state.temuan = ref.form(arrParam, oid.id, onSubmit)

    },

    newRecc: (e) => {
        var oid = new ObjectID
        ref.formId = oid.id
        e = e || window.event;

        var newReccEntry = (refid) => {
            var oid = new ObjectID

            ref.formId = oid.id
            var arrParam = [
                { id: "id", type: "text", ph: oid.id, value: oid.id, disabled: true },
                { id: "bobot", type: "number", ph: "BOBOT", value: 100, disabled: false },
                { id: "desc", type: "text", ph: "Uraian", value: "", disabled: false },
                { id: "refid", type: "text", ph: refid, value: "", disabled: true }
            ]
            var ids = arrParam.map(arr => arr.id)

            var onSubmit = () => {

                var rekomendasi = {
                    id: document.getElementById(ids[0]).value,
                    bobot: document.getElementById(ids[1]).value,
                    desc: document.getElementById(ids[2]).value,
                    refid: document.getElementById(ids[2]).value
                }
                var exArray = ref.recData.rekomendasi

                if (exArray == undefined) {
                    var Obj = { rekomendasi: [rekomendasi] }
                } else {

                    exArray.push(rekomendasi)
                    var Obj = { rekomendasi: exArray }
                }

                Object.assign(ref.recData, Obj)

                ref.newRecc = rekomendasi
                ref.newReccAllowed = true

                ref.state.rekomendasi = null
                ref.formId = null

            }

            ref.state.rekomendasi = ref.form(arrParam, oid.id, onSubmit)
        }

        var target = e.target;
        while (target && target.nodeName !== "TD") { target = target.parentNode }

        if (target) {
            console.log(ref.recData.temuan.length)

            var objParam = {}
            var arrParam = []
            for (var x = 0; x < ref.recData.temuan.length; x++) {

                objParam = { kode: ref.recData.temuan[x].id, desc: ref.recData.temuan[x].desc }
                arrParam.push(objParam)
            }
            console.log(arrParam)
            var onSubmit = () => {

                var selectEl = document.getElementById(ref.formId);

                var values = [...selectEl.selectedOptions].map(option => option.value);
                ref.newRecc = { refid: values }

                ref.state.rekomendasi = null
                newReccEntry(ref.newRecc.refid)

            }


            ref.state.rekomendasi = ref.form(arrParam, oid.id, onSubmit)
            console.log(arrParam)
            m.redraw()

            //   target.innerHTML = "dasdsd"
        }
    },
    subTable: (id, bobot, desc, refid) => {

        var content = '<table><tbody>'
        content += '<tr>'
        content += '<td>' + id + '</td>'
        content += '<td>' + bobot + '</td>'
        content += '</tr>'
        content += '<tr>'
        content += ' <td colspan = "2">'
        content += desc
        content += ' </td>'
        content += '</tr><tr><td colspan = "2">' + refid + '</td></tr>'
        content += '   </tbody>'

        content += ' </table>'
        return content
    },

    newTemuanRow: (el) => {

        
        var rowCount = el.rows.length;
        var row = el.insertRow(rowCount);
        var colCount = el.rows[0].cells.length;

        for (var i = 0; i < colCount; i++) {
            var newcell = row.insertCell(i)
            if (i == 2) {
                newcell.addEventListener("click", ref.newRecc)
            }
        }

        var no = ref.recData.temuan.length

        row.cells[0].innerHTML = no
        row.cells[1].innerHTML = ref.subTable(ref.newTemuan.id, ref.newTemuan.bobot, ref.newTemuan.desc, null)

        ref.newTemuanallowed = false
        ref.newTemuan = null
        el = null
        row = null
        rowCount = null

    },

    // newRecc : (tableID)=>{  var table = document.getElementById(tableID);

    // },

    controller: () => {

        var el = document.getElementById(ref.tabId)
        if (el == undefined) {
            var table = ref.tabelBaru(ref.tabId)
            ref.tableComp = m.trust(table)

        }

        if (el && ref.newTemuanallowed) {
            ref.newTemuanRow(el)
        }

    },

    tabelBaru: (id) => {

        const titles = ["NO", "TEMUAN", "REKOMENDASI", "USULAN TINDAK LANJUT", "TINDAK LANJUT", "KEKURANGAN TINDAK LANJUT", "STATUS TL", "KETERANGAN"]
        var table = '<div class="box"><div></div><div class="tableFixHead table-container"><table class="table is-bordered is-hoverable is-fullwidth " id=' + id + '>'
            + '<thead><tr>'
        for (var x = 0; x < titles.length; x++) {
            table += '<th>' + titles[x] + '</th>'
        }
        table += '</tr></thead><tbody><tr>'

        for (var x = 1; x < titles.length + 1; x++) {
            table += '<td style="text-align:center;">' + x + '</td>'
        }

        table += '</tr></tbody></table>'

        return table

    },
}

const temuan = {


    onupdate: ref.controller,
    view: () => {
        return m('div', m("a", { "href": "#openModal", "onclick": ref.temuanBaru }, "Temuan Baru"),
            m('div', ref.makeModal("temuan")),
            m('div', ref.makeModal("rekomendasi")),
            m('div', ref.makeModal("usulan")),
            m('div', ref.makeModal("tindakljt")),
            m('div', ref.makeModal("kekurangan")),
            m('div', ref.makeModal("status")),
            m('div', ref.makeModal("keterangan")),

            m('div', ref.tableComp))


    }
}

 

m.mount(document.body, temuan);

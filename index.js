import 'regenerator-runtime/runtime';
import m from 'mithril';


//var genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function ObjectID(str) {
    this.id = str + (Math.floor(Date.now() / 1000)).toString(16)// + genRanHex(16)
}

var ref = {
    tableComp: null,
    recBttn: null,
    newrowallowed: false,
    newReccAllowed: false,
    TemuanRef: {},
    state: {},
    formId: null,
    recData: {},
    newTemuan: null,
    newRecc: null,
    tabId: "tabelUtama",
    target: null,

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
                                        return m("option", { "value": sc.kode, },
                                            sc.desc)

                                    })
                                )))),
                m("div", { "class": "control" },
                    m("button", { "class": "button is-link", onclick: onSubmit },
                        "Submit"
                    ))))
    },

    temuanBaru: () => {

        var oid = new ObjectID('Temuan')
        ref.recBttn = null

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
            var Obj, Obj2
            if (exArray == undefined) { Obj = { temuan: [temuan] } } else {

                exArray.push(temuan)

                Obj = { temuan: exArray }
            }

            Object.assign(ref.recData, Obj)

            ref.newTemuan = temuan

            exArray = ref.TemuanRef.ref
            if (exArray == undefined) { Obj2 = { ref: [temuan] } } else {

                exArray.push(temuan)
                Obj2 = { ref: exArray }
            }
            Object.assign(ref.TemuanRef, Obj2)

            ref.newrowallowed = true
            ref.state.form = null
            ref.formId = null

        }

        ref.state.form = ref.form(arrParam, oid.id, onSubmit)

    },

    insRecc: () => {

        console.log("new rec bttn clicked")


        ref.newReccom(ref.newRow())


    },

    newReccom: (e) => {

     
        var oid = new ObjectID('Recc')
        ref.formId = oid.id
        e = e || window.event;

      
        var target =   e.target
        if(target.innerHTML=="Rekomendasi Baru"){target = ref.target}
  
        console.log(target)
        var thisrow = target.parentNode
        ref.target = null

        var newReccEntry = (refid) => {

            var oid = new ObjectID('Recc')

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
                    refid: refid
                }
                var exArray = ref.recData.rekomendasi
                var Obj

                if (exArray == undefined) { Obj = { rekomendasi: [rekomendasi] } } else {

                    exArray.push(rekomendasi)
                    Obj = { rekomendasi: exArray }
                }

                Object.assign(ref.recData, Obj)

                ref.newRecc = rekomendasi

               
                var len = ref.newRecc.refid.length
                if (len > 1) {

                    for (var x = 0; x < len - 1; x++) {

                        var next = thisrow.parentNode.rows[thisrow.rowIndex + x];
                        var cell = next.getElementsByClassName("rekomendasi")
                        cell[0].outerHTML = null
                    }

                    target.setAttribute('rowspan', len)
                    target.setAttribute('valign', "middle")


                } else if(ref.newReccAllowed){
                    var prevRow = thisrow.previousElementSibling;
                        var cell = prevRow.getElementsByClassName("temuan")
                         var befcell = thisrow.getElementsByClassName("temuan")
                         befcell[0].outerHTML = null
                         console.log(cell.length)
                        while(cell.length<1){
                            var prevRow = prevRow.previousElementSibling;
                            cell = prevRow.getElementsByClassName("temuan")
                            console.log(cell.length)
                        }
                        console.log(cell)
                         console.log(cell[0].getAttribute('rowspan'))
                        if(cell[0].getAttribute('rowspan')==null){
                            cell[0].setAttribute('rowspan',2)
                        } else {
                           var r=Number(cell[0].getAttribute('rowspan'))
                           cell[0].setAttribute('rowspan',r+1)
                        }
                        
                       
                }

                target.innerHTML = ref.subTable(ref.newRecc.id, ref.newRecc.bobot, ref.newRecc.desc, ref.newRecc.refid)

                if (ref.TemuanRef.ref.length == 1) {
                    var id = ref.TemuanRef.ref[0].id
                    var bool = false

                    ref.recData.rekomendasi.map(item => {
                        return item.refid.map(i => {
                            if (i == id) { bool = true }
                        })

                    })

                    if (bool) {
                        ref.newReccAllowed = true
                        ref.recBttn = m("button", { "class": "button is-success", "onclick": ref.insRecc }, "Rekomendasi Baru")
                    }
                }


                ref.state.form = null
                ref.formId = null
                ref.newRecc = null

               

            }

            ref.state.form = ref.form(arrParam, oid.id, onSubmit)
        }


        if (target) {


            var prevRow = thisrow.previousElementSibling;

            console.log(prevRow.rowIndex)

            if (prevRow.rowIndex > 1 && prevRow.cells.length == 8) {
                var cell = prevRow.getElementsByClassName("rekomendasi")


                if (cell[0].innerHTML == "") {

                    alert("Cell rekomendasi di atas masih ada yg kosong")
                    return
                }

            }


            var objParam = null
            var arrParam = []

            for (var x = 0; x < ref.TemuanRef.ref.length; x++) {

                objParam = { kode: ref.TemuanRef.ref[x].id, desc: ref.TemuanRef.ref[x].desc }
                arrParam.push(objParam)
            }

 
            console.log(arrParam)

            var onSubmit = () => {

                var selectEl = document.getElementById(ref.formId);
                var arrSel = [], Obj

                var values = [...selectEl.selectedOptions].map(option => {
                    Obj = { id: option.value, desc: option.innerHTML },
                        arrSel.push(Obj)
                    return option.value
                });
                var newArr = []
                if (ref.TemuanRef.ref.length > 1) {
                    ref.TemuanRef.ref.map((item, idx) => {
                        return arrSel.map(selected => {
                            item.id == selected.id ? ref.TemuanRef.ref[idx] = null : true
                        })
                    })

 
                    ref.TemuanRef.ref.map(item => {
                        item != null ? newArr.push(item) : true
                    })

                    ref.TemuanRef.ref = newArr
                }

   
                ref.state.form = null
           
                newReccEntry(values)


            }

            ref.state.form = ref.form(arrParam, oid.id, onSubmit)
           

            m.redraw()

             
        }
    },
    subTable: (id, bobot, desc, refid) => {

        var content = ' <table align="center"><tbody>'
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

        content += ' </table> '
        return content
    },

    newRow: () => {

        console.log("newrow called")

        var table = document.getElementById(ref.tabId);
        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);
        var colCount = table.rows[0].cells.length;

        for (var i = 0; i < colCount; i++) {
            var newcell = row.insertCell(i)
            if (i == 1) {
                
                newcell.classList.add("temuan");
            }
            if (i == 2) {
                newcell.addEventListener("click", ref.newReccom)
                newcell.classList.add("rekomendasi");
            }
        }

        var no = row.rowIndex - 1

        row.cells[0].innerHTML = no

        if (ref.newrowallowed) row.cells[1].innerHTML = ref.subTable(ref.newTemuan.id, ref.newTemuan.bobot, ref.newTemuan.desc, null)


        ref.target = row.cells[2]
        ref.newrowallowed = false
        ref.newTemuan = null
        table = null
        row = null
        rowCount = null
 
    },

 
    paint: () => {

        var el = document.getElementById(ref.tabId)
        if (el == undefined) {
            var table = ref.tabelBaru(ref.tabId)
            ref.tableComp = m.trust(table)

            console.log("newtable called")

        }

        console.log("new row allowed,", ref.newrowallowed)

        if (el && ref.newrowallowed) {
            console.log("newrow called")
            ref.newRow()
        }

    },

    tabelBaru: (id) => {

        const titles = ["NO", "TEMUAN", "REKOMENDASI", "USULAN TINDAK LANJUT", "TINDAK LANJUT", "KEKURANGAN TINDAK LANJUT", "STATUS TL", "KETERANGAN"]
        var table = '<div class="box"><table class="table is-bordered" margin="auto" id=' + id + '>'
            + '<thead><tr>'
        for (var x = 0; x < titles.length; x++) {
            table += '<th style="text-align:center;">' + titles[x] + '</th>'
        }
        table += '</tr></thead><tbody><tr>'

        for (var x = 1; x < titles.length + 1; x++) {
            table += '<td style="text-align:center;">' + x + '</td>'
        }

        table += '</tr></tbody></table></div>'

        return table

    },
}

const main = {


    onupdate: ref.paint,
    view: () => {
        return m('div', m("button", { "class": "button is-success", "onclick": ref.temuanBaru }, "Temuan Baru"), ref.recBttn,
            m('div', ref.makeModal("form")),
            m('div', ref.tableComp))


    }
}

 
m.mount(document.body, main);

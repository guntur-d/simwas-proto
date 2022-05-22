import m from 'mithril'
import rekomendasi from './rekomendasi'





var ref = {

    toggle: false,

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

    ObjectID: (str) => {
        return str + (Math.floor(Date.now() / 1000)).toString(16)
        //var genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    },

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



    newRow: () => {

        console.log("newrow called")

        var table = document.getElementById(ref.tabId);
        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);
        var colCount = table.rows[0].cells.length;

        for (var i = 0; i < colCount; i++) {
            var newcell = row.insertCell(i)
            if (i == 0) {

                newcell.classList.add("urutan");
            }

            if (i == 1) {

                newcell.classList.add("temuan");
            }
            if (i == 2) {
                newcell.onclick = rekomendasi.newReccom
                newcell.classList.add("rekomendasi");
            }
        }

 
        var no = row.rowIndex - 1
    
        if (no > 1) {
            var prevRow = row.previousElementSibling;


            var cell = prevRow.getElementsByClassName("urutan")
            while (cell.length < 1) {
                var prevRow = prevRow.previousElementSibling;

                cell = prevRow.getElementsByClassName("urutan")

            }
        
            var no = Number(cell[0].innerHTML)+1
        }

        row.cells[0].innerHTML = no



        if (ref.newrowallowed) row.cells[1].innerHTML = ref.subTable(ref.newTemuan.id, ref.newTemuan.bobot, ref.newTemuan.desc, null)


        ref.target = row.cells[2]
        ref.newrowallowed = false
        ref.newTemuan = null
        table = null
        row = null
        rowCount = null
        m.redraw()

    },

    editThisCell: (e) => {
        console.log("call edit")
        e = e || window.event;

        var target = e.target
        while (target && target.className !== "table") {
            target = target.parentNode
            console.log(target)
        }


        if (target) {
            var id = target.querySelector(".oid").innerHTML
            var bobot = target.querySelector("#bobot_" + id).innerHTML
            var desc = target.querySelector("#desc_" + id).innerHTML
            var refid = target.querySelector("#refid_" + id).innerHTML

            console.log(id, bobot, desc, refid)
        }

        console.log(ref.recData)
        var keyData = id.slice(0, -8)
        ref.target = target.parentNode

        var arrParam = [
            { id: "id", type: "text", ph: id, value: id, disabled: true },
            { id: "bobot", type: "number", ph: bobot, value: bobot, disabled: false },
            { id: "desc", type: "text", ph: desc, value: desc, disabled: false },
            { id: "refid", type: "text", ph: refid, value: refid, disabled: true }

        ]

        var ids = arrParam.map(arr => arr.id)


        var onSubmit = (e) => {

            e.preventDefault()
            console.log(ref.recData)
            var index
            ref.recData[keyData].map((item, idx) => {

                if (item.id = id) { return index = idx }

            })
            ids.map((val, idx) => {
                ref.recData[keyData][index][val] = document.getElementById(val).value
            })
            console.log(index)

            console.log(ref.recData)
            ref.newrowallowed = false
            ref.state.form = null

            ref.target.innerHTML = ref.subTable(ref.recData[keyData][index].id,
                ref.recData[keyData][index].bobot,
                ref.recData[keyData][index].desc,
                ref.recData[keyData][index].refid)

            ref.target = null

        }

        ref.state.form = ref.form(arrParam, id, onSubmit)
        m.redraw()

    },


    paint: () => {

        var elTgl = document.getElementById("toggle")
        elTgl ? !elTgl.hasChildNodes() ? ref.toggleUp() : null : null


        var el = document.getElementById(ref.tabId)
        if (el && el.rows.length > 1) {

            for (var element of el.getElementsByClassName("editCellBtn")) {

                element.onclick = ref.editThisCell
            }
        }
        if (el == undefined) {
            var table = ref.tabelBaru(ref.tabId)
            ref.tableComp = m.trust(table)


        }

        //  console.log("new row allowed,", ref.newrowallowed)

        if (el && ref.newrowallowed) {

            ref.newRow()
        }

        if (el && !ref.toggle) {

            for (var element of document.getElementsByClassName("plsHide")) {
                element.style.display = "none"
            }
            for (var element of document.getElementsByClassName("plsDelborder")) {
                element.style.border = "none"
            }
        }

        if (el && ref.toggle) {

            for (var element of document.getElementsByClassName("plsHide")) {
                element.style.display = "table-cell"
            }
            for (var element of document.getElementsByClassName("plsDelborder")) {
                element.style.border = "1px solid #dbdbdb";
            }
        }

        console.log(ref.recData)
        console.log(ref.tableComp.children)


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


    subTable: (id, bobot, desc, refid) => {

        var content = '<table class="table" ><tbody class="data"><tr ><td class="oid plsHide">' + id + '</td><td class="plsDelborder" style="border:none;"id="bobot_' + id + '">Bobot: ' + bobot + ' %</td></tr>'
        content += '<tr ><td class="plsDelborder desc" colspan = "2" id="desc_' + id + '">' + desc + '</td></tr>'
        content += '<tr><td colspan = "2" class="plsHide" id="refid_' + id + '">' + refid + '</td></tr>'
        content += '<tr><td style="border:none;" class="plsHide"><div class="buttons"><button class="button is-info editCellBtn">Edit</button></div></td>'
        content += '<td style="border:none;" class="plsHide"><div class="buttons"><button class="button is-danger disArmMe delCellBtn">Hapus</button></div></td>'
        content += '</tr>'

        content += '</tbody></table>'
        return content


    },

    // assigned function


    insRecc: () => {

        console.log("new rec bttn clicked")
        rekomendasi.newReccom(ref.newRow())


    },

    toggleUp: () => {


        var defaultSetting = "off"

        const toggleButton = document.createElement('toggleButton');
        toggleButton.onclick = function () { toggleSwitchTransformFunction() };
        document.getElementById("toggle").appendChild(toggleButton);

        const toggleSwitchCircle = document.createElement('toggleSwitchCircle');
        toggleButton.appendChild(toggleSwitchCircle);

        var toggleSwitchTransformFunction = () => {
            if (defaultSetting == "off") {

                defaultSetting = "on"
                toggleSwitchCircle.style.transform = "translateX(100%)"
                toggleButton.style.background = "hsl(171, 100%, 41%)"
                ref.toggle = true
                m.redraw()


                // execute code when ON

            } else if (defaultSetting == "on") {
                defaultSetting = "off"
                toggleSwitchCircle.style.transform = "translateX(0%)"
                toggleButton.style.background = "white"
                ref.toggle = false
                m.redraw()

                // execute code when OFF

            }
        }
    }
}

export default ref

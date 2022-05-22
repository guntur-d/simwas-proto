import ref from "./ref"
import m from 'mithril'

var rekomendasi = {



    newReccom: (e) => {


        var oid = ref.ObjectID('Recc')
        ref.formId = oid
        e = e || window.event;


        var target = e.target
        if (target.innerHTML == "Rekomendasi Baru") { target = ref.target }

        console.log(target)
        var thisrow = target.parentNode
        ref.target = null

        var newReccEntry = (refid) => {

            var oid = ref.ObjectID('rekomendasi')

            ref.formId = oid
            var arrParam = [
                { id: "id", type: "text", ph: oid, value: oid, disabled: true },
                { id: "bobot", type: "number", ph: "BOBOT", value: 100, disabled: false },
                { id: "desc", type: "text", ph: "Uraian", value: "", disabled: false },
                { id: "refid", type: "text", ph: refid, value: "", disabled: true }
            ]
            var ids = arrParam.map(arr => arr.id)

            var onSubmit = (e) => {

                e.preventDefault()
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


                } else if (ref.newReccAllowed) {
                    var prevRow = thisrow.previousElementSibling;
                    var cell = prevRow.getElementsByClassName("temuan")
                    var befcell = thisrow.getElementsByClassName("temuan")
                    befcell[0].outerHTML = null
                    console.log(cell.length)
                    while (cell.length < 1) {
                        var prevRow = prevRow.previousElementSibling;
                        cell = prevRow.getElementsByClassName("temuan")
                        console.log(cell.length)
                    }
                    console.log(cell)
                    console.log(cell[0].getAttribute('rowspan'))
                    if (cell[0].getAttribute('rowspan') == null) {
                        cell[0].setAttribute('rowspan', 2)
                    } else {
                        var r = Number(cell[0].getAttribute('rowspan'))
                        cell[0].setAttribute('rowspan', r + 1)
                    }


                }

                target.onclick = null
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

                m.redraw()

            }

            ref.state.form = ref.form(arrParam, oid, onSubmit)
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

            var onSubmit = (e) => {

                e.preventDefault()

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

            ref.state.form = ref.form(arrParam, oid, onSubmit)

            m.redraw()

        }
    },



}


export default rekomendasi
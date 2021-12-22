const express = require('express')
const app = express()
const items = require('./express/state')
const cors = require('cors')
var fs = require('fs')

app.use(cors())
app.use(express.json())
app.get('/stickers', (req, res) => {
    res.json({success:true})
})

app.post('/stickers', (req, res) => {

    fs.writeFile('database.txt', JSON.stringify(req.body.clonedProduct), (error) => {
        console.log(error)
    })
})
app.get('/stickers', (req, res) => {
    fs.readFile('database.txt', "utf-8", (err, data) => {
        const product = JSON.parse(data.toString());
        console.log("called")
        res.json(product)

    })
})
app.get('/orders', (req, res) => {
    console.log('order get')
    fs.readFile('order.txt', "utf-8", (err, data) => {
        const order = JSON.parse(data.toString());
        console.log("called")
        res.json(order)

    })
})
app.post('/orders', (req, res) => {
    console.log('orders post')
    let id = req.body.id
    let size = req.body.size
    let img = id + ".png"
    let operation = req.body.operation
    console.log(operation)
    var verifyOrder = (id, orderList, type, operation) => {
        if (operation == "add") {
            var i = null;
            for (i = 0; orderList.length > i; i += 1) {
                if (orderList[i].id === id) {
                    if (type in orderList[i]) {
                        if (type === "small") {
                            orderList[i]["small"]++
                            orderList[i]["total"]++
                        } else if (type === "medium") {
                            orderList[i]["medium"]++
                            orderList[i]["total"]++
                        } else if (type === "large") {
                            orderList[i]["large"]++
                            orderList[i]["total"]++
                        }
                        return orderList
                    } else {
                        if (type === "small") {
                            orderList[i]["small"] = 1
                            orderList[i]["total"]++
                            return orderList
                        } else if (type === "medium") {
                            orderList[i]["medium"] = 1
                            orderList[i]["total"]++
                            return orderList

                        } else if (type === "large") {
                            orderList[i]["large"] = 1
                            orderList[i]["total"]++
                            return orderList
                        }
                    }
                }
            }
            if (type === "small") {
                orderList.push({
                    "id": id,
                    "img": img,
                    "small": 1,
                    total: 1
                })
            } else if (type === "medium") {
                orderList.push({
                    "id": id,
                    "img": img,
                    "medium": 1,
                    total: 1
                })
            } else if (type === "large") {
                orderList.push({
                    "id": id,
                    "img": img,
                    "large": 1,
                    total: 1
                })

            }
            return orderList


        } else if (operation == "sub") {
            for (i = 0; orderList.length > i; i += 1) {
                if (orderList[i].id === id) {
                    if (type in orderList[i]) {
                        if (type === "small") {
                            orderList[i]["small"]--
                            orderList[i]["total"]--
                        } else if (type === "medium") {
                            orderList[i]["medium"]--
                            orderList[i]["total"]--
                        } else if (type === "large") {
                            orderList[i]["large"]--
                            orderList[i]["total"]--
                        }
                        return orderList
                    } else {
                        if (type === "small") {
                            orderList[i]["small"] = 1
                            orderList[i]["total"]++
                            return orderList
                        } else if (type === "medium") {
                            orderList[i]["medium"] = 1
                            orderList[i]["total"]++
                            return orderList

                        } else if (type === "large") {
                            orderList[i]["large"] = 1
                            orderList[i]["total"]++
                            return orderList
                        }
                    }
                }
            }
        }
    };
    fs.readFile('order.txt', "utf-8", (err, data) => {
        let order = JSON.parse(data.toString());
        let newOrder = verifyOrder(id, order, size, operation)
        // console.log(newOrder)
        fs.writeFile('order.txt', JSON.stringify(newOrder), (error) => {
            console.log(error)
        })
        res.json(newOrder)
    })

})

const PORT = process.env.PORT || 5000
app.listen(PORT)
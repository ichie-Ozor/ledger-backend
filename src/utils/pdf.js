export const sendPDFMail = (user, data) => {
    const formattedDate = new Date().toLocaleDateString();

    const dataHTML = data.map(i => (
        `<div class="render">
            <span>${i.goods}</span>
            <span>${i.qty}</span>
            <span>${i.cost}</span>
        </div>`
    )).join('')

    return `
    <style type="text/css">
    .fff {
            background-color: yellow;
            color: red;
            font-size: 20px;
            text-decoration: none;
            padding: 10px;
            display: inline-block;
        }
        .render {
            display: flex
            gap: 50px;
            width: 100%;
            align-items: center;
            border-bottom: 1px solid black;
            padding: 14px;
            justify-content: space-between;
            margin-bottom: 3px;
        }
        .render span {
            display: block;
            width: 33%;
            text-align: center;
        }
        .header {
            background-color: #999966;
            padding: 10px;
            width: 100%;
            font-size: 15px;
            color: white;
        }
    .item {
            display: flex;
            background-color: #e4e4e4;
            font-weight: bold;
            width: 100%;
            padding: 10px;
            gap: 50px;
            justify-content: space-between;
        }
        .item span {
            display: inline-block;
            width: 33%;
            text-align: center;
        }
        .items {
            background-color: #f4f4f4;
            font-weight: bold;
            bord
            width: 100%;
            padding: 10px;
            gap: 50px;
            justify-content: space-between;
        }
        .items:nth-child(2){
            background-color: #e4e4e4;
        }
    </style>
        <div class="header">
            <p>This is the Stock of goods entered as at ${formattedDate}</p>
            <p>Name: ${user}</p>
        </div>
        <div class="item">
           <span>Description</span>
           <span>Qty</span>
           <span>Cost</span>
        </div>
        <div class="items">
            ${dataHTML}
        </div>
    `;
}
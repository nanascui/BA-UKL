const { coffe, order_detail, order_list } = require(`../models/index`);
const { Op } = require(`sequelize`);

exports.findAll = async (req, res) => {
  try {
    // Extract date from request body
    const { date } = req.body;

    // Initialize the query options
    let queryOptions = {
      include: [{
        model: order_detail,
        as: 'listCoffe',
        include: [coffe]
      }],
      order: [['order_date', 'ASC']] // Default ordering by order_date
    };

    // Add date filter if date is provided
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      queryOptions.where = {
        order_date: {
          [Op.between]: [startOfDay, endOfDay]
        }
      };
    }

    // Fetch orders based on the query options
    let orders = await order_list.findAll(queryOptions);

    return res.json({
      success: true,
      data: orders,
      message: 'Order list has been retrieved along with order details'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  

exports.addOrder = async (req, res) => {
  try {
    const { customer_name, order_type, order_date, order_Detail } = req.body;

    // Buat entri OrderList baru
    const orderList = await order_list.create({
      customer_name,
      order_type,
      order_date,
    });

    // Iterasi melalui setiap detail pesanan dan buat entri OrderDetail
    for (const item of order_Detail) {
      const { coffee_id, price, quantity } = item;
      await order_etail.create({
        orderID: orderList.orderID,
        coffeID: coffee_id,
        price,
        quantity,
      });
    }

    res.status(201).json({
      data: {
        id: orderList.orderID,
        customer_name,
        order_type,
        order_date,
      },
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

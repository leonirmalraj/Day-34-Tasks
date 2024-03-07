import { findIndex } from "../common/findIndex.js";

const Rooms = [
    {
        room_id: 1,
        room_name: "First_Class_with_AC",
        booked_status: true,
        price_for_1_hours: 8000,
    },
    {
        room_id: 2,
        room_name: "First_Class_With_Non_AC",
        booked_status: true,
        price_for_1_hours: 6000,
    },
    {
        room_id: 3,
        room_name: "Second_Class_with_AC",
        booked_status: true,
        price_for_1_hours: 4000,
    },
    {
        room_id: 4,
        room_name: "Second_Class_with_Non_AC",
        booked_status: false,
        price_for_1_hours: 2000,
    }
]

const Customer = [
    {
        room_id: 1,
        customer_id: 1,
        name: "Santhosh Srinivasan",
        date: "23/01/2024",
        start_time: "08:00:00 am",
        end_time: "11:20:12 pm",
    },
    {
        room_id: 2,
        customer_id: 2,
        name: "Surya Gunasekaran",
        date: "23/01/2024",
        start_time: "06:40:09 am",
        end_time: "09:35:46 pm",
    },
    {
        room_id: 3,
        customer_id: 3,
        name: "Shiyam Saravanan",
        date: "23/01/2024",
        start_time: "07:30:23 pm",
        end_time: "06:30:09 am",
    },
]

const BookedRooms = (req, res) => {
    try {
        const BookedRoom = Rooms.map(room => ({
            Room_Name: room.room_name,
            Booked_Status: room.booked_status,
            customer: Customer.find(cust => cust.room_id === room.room_id),
        }));
        res.status(200).send(BookedRoom);
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
}

const allCustomer = (req, res) => {
    try {
        const BookedRoom = Rooms.flatMap(room => {
            const customer = Customer.find(cust => cust.room_id === room.room_id);
            if (customer) {
                return {
                    Customer: customer.name,
                    Room_Name: room.room_name,
                    Date: customer.date,
                    Start_Time: customer.start_time,
                    End_Time: customer.end_time,
                    Booked_Status: room.booked_status,
                };
            }
        });
        res.status(200).send(BookedRoom);
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
}

const CreateRoom = (req, res) => {
    try {
        const id = Rooms.length ? Rooms[Rooms.length - 1].room_id + 1 : 1;
        req.body.room_id = id;
        req.body.room_name = `room-${id}`;
        req.body.booked_status = false;

        Rooms.push(req.body);
        res.status(200).send({
            message: "Room Added Successfully",
        });
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
}

const DeleteRoom = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = findIndex(Rooms, id);
        if (index !== -1) {
            Rooms.splice(index, 1);
            res.status(200).send({
                message: "Room Deleted Successfully",
            });
        } else {
            res.status(400).send({
                message: "Invalid Room Id",
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
}

const Booking = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = findIndex(Rooms, id);
        if (index !== -1 && !Rooms[index].booked_status) {
            Rooms[index].booked_status = true;
            const { name, date, start_time, end_time } = req.body;
            const newCustomerId = Customer.length ? Customer[Customer.length - 1].customer_id + 1 : 1;
            const newCustomer = {
                customer_id: newCustomerId,
                name,
                date,
                start_time,
                end_time,
                room_id: id,
            };
            Customer.push(newCustomer);
            res.status(200).send({
                message: "Room Booking Successfully",
            });
        } else if (index !== -1 && Rooms[index].booked_status) {
            res.status(500).send({
                message: "This Room is already booked",
            });
        } else {
            res.status(400).send({
                message: "Invalid Room Id",
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
}

export default {
    BookedRooms,
    allCustomer,
    CreateRoom,
    DeleteRoom,
    Booking
}

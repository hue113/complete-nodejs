const express = require("express");
const fs = require("fs");

const app = express();

// 1. MiDDLEWARE
app.use(express.json());
app.use((req, res, next) => {
  // convention naming: next; but you can name anything you want
  console.log("Hello from the middleware 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2. ROUTE HANDLERS
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  // console.log(req.params);
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === id); // eg: req.params: { id: '5' } --> need to convert to number

  if (!tour) {
    // OR: if (id > tours.length - 1)
    return res.status(400).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(201).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  // const newTour = { id: newId, ...req.body };
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  // tours = { ...tours, newTour };				// ko dung the nay (bz tours is constant, cannot assign new value)

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
  res.send("Done");
};

const updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  const updatedTour = { ...tour, ...req.body };
  const updatedTours = tours.map((tour) =>
    tour.id === updatedTour.id ? updatedTour : tour
  );
  // DIFFERENT WAY TO UPDATE TOURS:
  // const index = tours.findIndex((item) => item.id === id);
  // const updatedTours = [...tours];
  // updatedTours[index] = updatedTour; // updatedTours[tour.id] might not be index in different case

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      res.status(200).json({
        status: "success",
        data: {
          tour: updatedTour,
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  const updatedTours = tours.filter((tour) => tour.id !== id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );
};

// 3. ROUTES
// app.get("/api/v1/tours", getAllTours); // 1. GET ALL TOURS
// app.get("/api/v1/tours/:id", getTour); // 2. GET A TOUR
// app.post("/api/v1/tours", createTour); // 3. POST A TOUR
// app.patch("/api/v1/tours/:id", updateTour); // 4. PATCH A TOUR
// app.delete("/api/v1/tours/:id", deleteTour); // 5. DELETE A TOUR

app.route("/api/v1/tours").get(getAllTours).post(createTour);
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// 4. SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id: ${val}`);

  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === id); // eg: req.params: { id: '5' } --> need to convert to number
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params);
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === id); // eg: req.params: { id: '5' } --> need to convert to number
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  res.send('Done');
};

exports.updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === id);
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
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTours = tours.filter((tour) => tour.id !== id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};

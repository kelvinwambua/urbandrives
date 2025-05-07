const cars = [
  { id: 1, 
    name: "Toyota", 
    pricePerDay: 50, 
    image: "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    
  },
  { id: 2, name: "Honda", pricePerDay: 45, image: "https://images.pexels.com/photos/4517072/pexels-photo-4517072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", },
  { id: 3, name: "VW", pricePerDay: 90, image: "https://images.pexels.com/photos/5763081/pexels-photo-5763081.jpeg", },
];

export default function CarsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cars for Rent</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="bg-white shadow-md p-4 rounded-xl">
            <img className = "w-500 h-60 p-4" src = {car.image} />
            <h2 className="text-xl font-semibold">{car.name}</h2>
            <p className="text-gray-600">${car.pricePerDay}/day</p>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Rent Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

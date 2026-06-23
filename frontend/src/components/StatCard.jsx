function StatCard({ title, value }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-gray-400">{title}</h3>

      <h1 className="text-white text-3xl font-bold mt-2">
        {value}
      </h1>
    </div>
  );
}

export default StatCard;
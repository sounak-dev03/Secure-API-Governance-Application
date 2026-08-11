function StatCard({ title, value, description }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mt-2">
        {value}
      </h2>

      <p className="text-xs text-gray-500 mt-2">
        {description}
      </p>

    </div>
  );
}

export default StatCard;
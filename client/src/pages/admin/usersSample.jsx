<div className="flex-1 p-6">


    
<div className="mb-8">
  <h1 className="text-3xl font-bold">Users</h1>
  <p className="text-gray-600">Manage all system users</p>
</div>

{/* Filters */}
<div className="card bg-base-100 shadow-xl mb-6 p-4">
  {/* Filter controls */}
</div>

{/* Users Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {users.map(user => (
    <UserCard key={user.id} user={user} />
  ))}
</div>

{/* Pagination */}
<Pagination 
  currentPage={page} 
  totalPages={Math.ceil(users.totalCount / 10)} 
  onPageChange={setPage}
/>




</div> 
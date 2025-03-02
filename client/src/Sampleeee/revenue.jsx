function TrainerRevenueDashboard({ trainer }) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Sort revenue history by date (oldest first)
    const sortedHistory = [...(trainer.revenueHistory || [])].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
    
    // Get last 6 months of data
    const recentMonths = sortedHistory.slice(-6);
    
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Revenue Dashboard</h2>
          
          <div className="stats shadow bg-primary text-primary-content">
            <div className="stat">
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">₹{trainer.totalRevenue.toLocaleString()}</div>
              <div className="stat-desc">Your 30% commission</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Total Clients</div>
              <div className="stat-value">{trainer.clients?.length || 0}</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Monthly Revenue</h3>
            
            {recentMonths.length > 0 ? (
              <div className="h-64 w-full">
                <div className="flex h-full items-end gap-1">
                  {recentMonths.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-primary w-full rounded-t-md tooltip tooltip-top transition-all hover:opacity-80" 
                        data-tip={`₹${item.revenue.toLocaleString()}`}
                        style={{ 
                          height: `${(item.revenue / Math.max(...recentMonths.map(d => d.revenue), 1)) * 100}%`,
                          minHeight: '4px'
                        }}
                      ></div>
                      <div className="mt-2 text-xs font-bold">
                        {monthNames[item.month]} {item.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>No revenue data available yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
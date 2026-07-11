import { useEffect, useState, useMemo } from "react";
import { Calendar, Search, ExternalLink, GraduationCap, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getHiringCalendar } from "../services/publicApi";
import toast from "react-hot-toast";

export default function HiringCalendar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      // Fetch up to 100 entries to allow robust client-side filtering and instant pagination
      const response = await getHiringCalendar({ page: 1, limit: 100 });
      setData(response.hiringCalenders || []);
    } catch (err) {
      toast.error(err.message || "Failed to load hiring calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());

      const itemMonth = item.hiringMonth
        ? new Date(item.hiringMonth).toLocaleString("default", { month: "long" })
        : "";
      const matchMonth = selectedMonth === "All" || itemMonth === selectedMonth;

      return matchSearch && matchMonth;
    });
  }, [data, search, selectedMonth]);

  // Paginate items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  // Adjust page counter if filtered output shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredItems, currentPage, totalPages]);

  // Month list builder for selector dropdown
  const monthOptions = [
    "All", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold flex items-center gap-2">
            <Calendar className="text-[color:var(--ncc-maroon)] h-7 w-7" />
            Hiring Calendar
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Keep track of upcoming placement drives and prepare in advance.
          </p>
        </div>
        <button
          onClick={fetchCalendar}
          className="flex items-center gap-1.5 text-xs font-semibold btn-outline max-w-max px-3 py-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Filters row */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/45"
          />
        </div>
        <div className="sm:w-60">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/45"
          >
            <option value="All">All Months (Calendar Year)</option>
            {monthOptions.slice(1).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabular View */}
      <div className="mt-6 card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border">
                <th className="p-4 sm:p-5">Company / Role</th>
                <th className="p-4 sm:p-5">Hiring Month</th>
                <th className="p-4 sm:p-5">Salary Package</th>
                <th className="p-4 sm:p-5">Prep Resources</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-muted-foreground">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-primary" /> Loading calendar...
                    </div>
                  </td>
                </tr>
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-muted-foreground">
                    No hiring calendars found matching filters.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 sm:p-5">
                      <div>
                        <div className="font-bold text-foreground">{item.companyName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground/75 mt-1 max-w-sm line-clamp-2">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 font-medium">
                      {item.hiringMonth
                        ? new Date(item.hiringMonth).toLocaleDateString("default", {
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="p-4 sm:p-5 font-semibold text-[color:var(--ncc-army)]">
                      {item.salaryRange || "Not Disclosed"}
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex flex-wrap gap-1.5">
                        {item.prepairResource?.length > 0 ? (
                          item.prepairResource.map((r, i) => (
                            <span key={i} className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/20">
                              <GraduationCap className="h-3 w-3" />
                              {r}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground/70">Self preparation</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      {item.applyLink ? (
                        <a
                          href={item.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                        >
                          Apply <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Coming soon</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {!loading && filteredItems.length > 0 && (
          <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Showing <strong className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
              <strong className="text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredItems.length)}
              </strong>{" "}
              of <strong className="text-foreground">{filteredItems.length}</strong> items
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

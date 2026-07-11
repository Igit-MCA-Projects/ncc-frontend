import { useEffect, useState, useMemo } from "react";
import { Shield, Search, Award, GraduationCap, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getNccBenefits } from "../services/publicApi";
import toast from "react-hot-toast";

export default function NccBenefits() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCert, setSelectedCert] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchBenefits = async () => {
    setLoading(true);
    try {
      const response = await getNccBenefits({ page: 1, limit: 100 });
      setData(response.nccBenifits || []);
    } catch (err) {
      toast.error(err.message || "Failed to load NCC benefits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenefits();
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.benifit?.toLowerCase().includes(search.toLowerCase()) ||
        item.bonusMark?.toLowerCase().includes(search.toLowerCase()) ||
        item.nccQuota?.toLowerCase().includes(search.toLowerCase()) ||
        item.cirtificate?.toLowerCase().includes(search.toLowerCase());

      const matchCert =
        selectedCert === "All" ||
        item.cirtificate?.toLowerCase() === selectedCert.toLowerCase() ||
        item.cirtificate?.toLowerCase().includes(selectedCert.toLowerCase());

      return matchSearch && matchCert;
    });
  }, [data, search, selectedCert]);

  // Paginate items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredItems, currentPage, totalPages]);

  const certFilters = ["All", "Certificate A", "Certificate B", "Certificate C"];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold flex items-center gap-2">
            <Shield className="text-[color:var(--ncc-army)] h-7 w-7" />
            NCC Benefits
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore reservation quotas, bonus points, and scholarship benefits unlocked by your certificates.
          </p>
        </div>
        <button
          onClick={fetchBenefits}
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
            placeholder="Search benefits, marks, or quotas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/45"
          />
        </div>
        <div className="sm:w-60">
          <select
            value={selectedCert}
            onChange={(e) => setSelectedCert(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/45"
          >
            <option value="All">All Certificates</option>
            <option value="A">Certificate 'A'</option>
            <option value="B">Certificate 'B'</option>
            <option value="C">Certificate 'C'</option>
          </select>
        </div>
      </div>

      {/* Tabular View */}
      <div className="mt-6 card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border">
                <th className="p-4 sm:p-5">Certificate Required</th>
                <th className="p-4 sm:p-5">Benefit Details</th>
                <th className="p-4 sm:p-5">Bonus Marks</th>
                <th className="p-4 sm:p-5">Quotas & Allocations</th>
                <th className="p-4 sm:p-5">Associated Scholarships</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-muted-foreground">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-primary" /> Loading benefits...
                    </div>
                  </td>
                </tr>
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-muted-foreground">
                    No NCC benefits found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 sm:p-5 min-w-[150px]">
                      <span className="inline-flex items-center gap-1.5 font-bold text-sm px-2.5 py-0.9 rounded-lg bg-[color:var(--ncc-army)]/10 text-[color:var(--ncc-army)] border border-[color:var(--ncc-army)]/25">
                        <Award className="h-3.5 w-3.5" />
                        Certificate {item.cirtificate}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-foreground leading-relaxed max-w-sm whitespace-pre-line">
                      {item.benifit}
                    </td>
                    <td className="p-4 sm:p-5 font-semibold text-foreground/90">
                      {item.bonusMark || (
                        <span className="text-xs text-muted-foreground/75 italic">Varies by scheme</span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5">
                      {item.nccQuota ? (
                        <span className="font-semibold text-[color:var(--ncc-maroon)] bg-[color:var(--ncc-maroon)]/8 px-2.5 py-1 rounded-md border border-[color:var(--ncc-maroon)]/15 text-xs inline-block">
                          {item.nccQuota}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/70 italic">None specified</span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex flex-col gap-1.5">
                        {item.Scholarship && (
                          <div className="font-medium text-xs flex items-center gap-1 text-primary">
                            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                            {item.Scholarship}
                          </div>
                        )}
                        {item.scholarships?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {item.scholarships.map((s, idx) => (
                              <span key={idx} className="text-[10px] bg-muted px-2 py-0.5 rounded-md border border-border/80 text-muted-foreground">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        {!item.Scholarship && (!item.scholarships || item.scholarships.length === 0) && (
                          <span className="text-xs text-muted-foreground/70 italic">No scholarships listed</span>
                        )}
                      </div>
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

/**
 * Subcontractor Dashboard Service
 * Handles data persistence for the Subcontractor Dashboard using localStorage.
 */

export interface Bid {
    id: string;
    projectName: string;
    gc: string;
    location: string;
    bidAmount: string;
    budgetValue: number;
    deadline: string;
    deadlineDate: string;
    status: 'DRAFT' | 'SUBMITTED' | 'IN-REVIEW' | 'WON' | 'LOST';
    daysLeft: number;
    lastModified: string;
    probability: number;
    type: 'active' | 'completed';
}

export interface Deployment {
    id: string;
    name: string;
    client: string;
    location: string;
    value: string;
    budgetValue: number;
    startDate: string;
    endDate: string;
    progress: number;
    status: 'ON-TRACK' | 'AT-RISK' | 'AHEAD' | 'DELAYED';
    phase: string;
    team: number;
    lastUpdate: string;
}

const STORAGE_KEYS = {
    BIDS: 'sc_bids_v2',
    DEPLOYMENTS: 'sc_deployments_v2',
    SAVED_PROJECTS: 'sc_saved_projects_v2'
};

const INITIAL_BIDS: Bid[] = [];

const INITIAL_DEPLOYMENTS: Deployment[] = [];

export const scDashboardService = {
    // Bids
    getBids: (): Bid[] => {
        const data = localStorage.getItem(STORAGE_KEYS.BIDS);
        if (!data) {
            localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(INITIAL_BIDS));
            return INITIAL_BIDS;
        }
        return JSON.parse(data);
    },

    saveBid: (bid: Bid) => {
        const bids = scDashboardService.getBids();
        const index = bids.findIndex(b => b.id === bid.id);
        if (index >= 0) {
            bids[index] = bid;
        } else {
            bids.push(bid);
        }
        localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
        return bids;
    },

    deleteBid: (id: string) => {
        const bids = scDashboardService.getBids().filter(b => b.id !== id);
        localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
        return bids;
    },

    // Deployments
    getDeployments: (): Deployment[] => {
        const data = localStorage.getItem(STORAGE_KEYS.DEPLOYMENTS);
        if (!data) {
            localStorage.setItem(STORAGE_KEYS.DEPLOYMENTS, JSON.stringify(INITIAL_DEPLOYMENTS));
            return INITIAL_DEPLOYMENTS;
        }
        return JSON.parse(data);
    },

    // Saved Projects
    getSavedProjects: (): string[] => {
        const data = localStorage.getItem(STORAGE_KEYS.SAVED_PROJECTS);
        return data ? JSON.parse(data) : [];
    },

    toggleSavedProject: (projectId: string) => {
        const saved = scDashboardService.getSavedProjects();
        const index = saved.indexOf(projectId);
        if (index >= 0) {
            saved.splice(index, 1);
        } else {
            saved.push(projectId);
        }
        localStorage.setItem(STORAGE_KEYS.SAVED_PROJECTS, JSON.stringify(saved));
        return saved;
    }
};

import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest'
import SchoolBatteriesSummary from "../components/SchoolBatteriesSummary.vue";

global.$fetch = vi.fn();

describe('SchoolBatteriesSummary', () => {

    test('renders "Fetching schools and battery data..." when sortedSchools is empty', async () => {
      const wrapper = mount(SchoolBatteriesSummary, {
        computed: {
          sortedSchools: () => []
        }
      });
  
      expect(wrapper.text()).toContain('Fetching schools and battery data...');
    });
  
    test('renders sorted schools and their battery data when sortedSchools is not empty', async () => {
      const mockSortedSchools = [
        ['30021', 4],
        ['30006', 2],
        ['30019', 2],
        ['30015', 1]
      ];
  
      const wrapper = mount(SchoolBatteriesSummary, {
        computed: {
          sortedSchools: () => mockSortedSchools
        }
      });
  
      const schoolDetails = wrapper.findAll('.school_details');
      expect(schoolDetails.length).toBe(mockSortedSchools.length);
  
      for (let i = 0; i < mockSortedSchools.length; i++) {
        const [schoolId, badBatteries] = mockSortedSchools[i];
  
        const summary = schoolDetails[i].find('.cursor-pointer span');
        expect(summary.text()).toContain(`School ${schoolId} (${badBatteries} Bad Batteries)`);
  
        const batteryRows = schoolDetails[i].findAll('tbody tr');
        expect(batteryRows.length).toBeGreaterThan(0);
      }
    });
    });

    function createFetchResponse(data) {
      return { json: () => new Promise((resolve) => resolve(data)) }
    }
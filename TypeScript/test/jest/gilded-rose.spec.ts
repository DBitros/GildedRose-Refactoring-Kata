import { Item, GildedRose } from '@/gilded-rose';

describe('GildedRose', () => {
  describe('updateQuality', () => {
    it('should decrease the quality and sellIn values for normal items', () => {
      const gildedRose = new GildedRose([new Item('normal item', 10, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).toBe(9);
      expect(items[0].quality).toBe(19);
    });

    it('should degrade quality twice as fast once the sell by date has passed', () => {
      const gildedRose = new GildedRose([new Item('normal item', 0, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(18);
    });

    it('should not decrease the quality of an item to a negative value', () => {
      const gildedRose = new GildedRose([new Item('normal item', 10, 0)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(0);
    });

    it('should increase the quality of "Aged Brie" as it gets older', () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 10, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(21);
    });

    it('"Sulfuras" should never decrease in quality or sellIn', () => {
      const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 10, 80)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).toBe(10);
      expect(items[0].quality).toBe(80);
    });

    describe('"Backstage passes" quality rules', () => {
      it('should increase in quality by 2 when there are 10 days or less', () => {
        const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).toBe(22);
      });

      it('should increase in quality by 3 when there are 5 days or less', () => {
        const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).toBe(23);
      });

      it('should drop quality to 0 after the concert', () => {
        const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).toBe(0);
      });
    });

    // Add more tests for "Conjured" items once that logic is implemented
    // it('should degrade "Conjured" items quality twice as fast as normal items', () => {
    //   const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 10, 20)]);
    //   const items = gildedRose.updateQuality();
    //   expect(items[0].quality).toBe(18);
    // });
  });
});

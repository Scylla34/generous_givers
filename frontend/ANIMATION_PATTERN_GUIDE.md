# Animation Pattern Guide

## Standard Animation Patterns Applied

### Pattern 1: Section Container with Fade-In
```tsx
<section className="mb-20 animate-fade-in" style={{ animationDelay: '200ms' }}>
  {/* Content */}
</section>
```
**Purpose:** Entire section fades in with delay to prevent visual overload
**Used in:** All major sections across all pages

---

### Pattern 2: Section Heading with Slide-Up
```tsx
<h2 className="text-3xl font-bold mb-6 animate-slide-up">Section Title</h2>
```
**Purpose:** Headings slide up immediately within their parent's fade-in
**Used in:** All section and subsection headings

---

### Pattern 3: Card Grid with Staggered Scale-In
```tsx
{items.map((item, idx) => (
  <div
    key={item.id}
    className="bg-white rounded-lg shadow-md animate-scale-in"
    style={{ animationDelay: `${idx * 100}ms` }}
  >
    {/* Card content */}
  </div>
))}
```
**Purpose:** Cards scale in sequentially, creating visual flow
**Used in:** Project cards, gallery grids, opportunity cards, etc.

---

### Pattern 4: List Items with Staggered Slide-Up
```tsx
<ul className="space-y-4">
  {items.map((item, idx) => (
    <li 
      key={item.id}
      className="animate-slide-up"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      {item.text}
    </li>
  ))}
</ul>
```
**Purpose:** List items appear sequentially for readability
**Used in:** Bullet point lists in Volunteer, Partnership, and Donation sections

---

### Pattern 5: Cascading Sections with Progressive Delays
```tsx
{/* First section */}
<section className="mb-20 animate-fade-in">
  <h2 className="animate-slide-up">Heading</h2>
  {/* Content */}
</section>

{/* Second section */}
<section className="mb-20 animate-fade-in" style={{ animationDelay: '100ms' }}>
  <h2 className="animate-slide-up">Heading</h2>
  {/* Content */}
</section>

{/* Third section */}
<section className="mb-20 animate-fade-in" style={{ animationDelay: '200ms' }}>
  <h2 className="animate-slide-up">Heading</h2>
  {/* Content */}
</section>
```
**Purpose:** Sections appear sequentially without overwhelming the page
**Used in:** About page (Mission → Vision → Core Values → History → What We Do → Leadership)

---

### Pattern 6: Image Gallery with Fast Cascade (50ms increments)
```tsx
<div className="grid grid-cols-4 gap-6">
  {images.map((img, idx) => (
    <div
      key={idx}
      className="animate-scale-in"
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      <Image src={img} alt={`Image ${idx}`} />
    </div>
  ))}
</div>
```
**Purpose:** Many images appear quickly in visual cascade
**Used in:** Children gallery section (8 images with 50ms delays)

---

### Pattern 7: Category Grid with Medium Cascade (80ms increments)
```tsx
<div className="grid grid-cols-3 gap-6">
  {categories.map((cat, idx) => (
    <div
      key={cat.id}
      className="animate-scale-in"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      {/* Content */}
    </div>
  ))}
</div>
```
**Purpose:** Grid of categories appears with balanced cascade speed
**Used in:** Non-cash donations section (6 items with 80ms delays)

---

### Pattern 8: Text Content with Staggered Paragraphs
```tsx
<div className="space-y-4">
  <p className="animate-slide-up" style={{ animationDelay: '100ms' }}>
    First paragraph...
  </p>
  <p className="animate-slide-up" style={{ animationDelay: '200ms' }}>
    Second paragraph...
  </p>
  <p className="animate-slide-up" style={{ animationDelay: '300ms' }}>
    Third paragraph...
  </p>
</div>
```
**Purpose:** Paragraphs appear sequentially for better readability
**Used in:** History section on About page

---

### Pattern 9: Highlight Container with Scale-In
```tsx
<div 
  className="bg-primary-50 rounded-lg p-8 border border-primary-100 animate-scale-in"
  style={{ animationDelay: '200ms' }}
>
  {/* Highlight content */}
</div>
```
**Purpose:** Important container scales in for emphasis
**Used in:** Leadership intro box on About page, form containers

---

### Pattern 10: Gradient Background Animation (Continuous)
```tsx
<section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 animate-gradient-shift">
  {/* Section content */}
</section>
```
**Purpose:** Background has subtle continuous animation
**Used in:** Call-to-action sections on Home page

---

## Animation Timing Convention

### Hero Section Animation Flow
1. **Hero heading:** `animate-fade-in` (immediate, 0ms)
2. **Hero subtitle:** `animate-slide-up` (100ms delay)

### Main Content Animation Flow
1. **Section container:** `animate-fade-in` (progressive delays per section)
2. **Section heading:** `animate-slide-up` (inside parent's fade-in)
3. **Content cards/items:** `animate-scale-in` or `animate-slide-up` (staggered per item)

### Card Animation Flow
1. **First card:** `${0 * 100}ms` = 0ms delay
2. **Second card:** `${1 * 100}ms` = 100ms delay
3. **Third card:** `${2 * 100}ms` = 200ms delay
4. **And so on...**

---

## Delay Pattern Decision Matrix

| Use Case | Increment | Reasoning | Example |
|----------|-----------|-----------|---------|
| Image galleries | 50ms | Feels fast, visual flow | Children gallery (8 images) |
| Category grids | 80ms | Medium pace, noticeable | Donation categories (6 items) |
| Standard cards | 100ms | Most common, well-balanced | Projects, opportunities, cards |
| Section offsets | 100-500ms | Prevents simultaneous sections | About page sections |

---

## CSS Classes Reference

### Entrance Animations
- `.animate-fade-in` - Opacity 0 → 1
- `.animate-slide-up` - Translate Y +20px → 0 with fade
- `.animate-slide-in-left` - Translate X from left with fade
- `.animate-slide-in-right` - Translate X from right with fade
- `.animate-scale-in` - Scale 0.95 → 1.0 with fade

### Continuous Animations
- `.animate-bounce` - Vertical bounce effect
- `.animate-float` - Gentle floating motion
- `.animate-gradient-shift` - Animated gradient background
- `.animate-gradient-border` - Animated border gradient

### Utility Classes
- `.animate-shake` - Horizontal shake (error states)
- `.animate-stagger-1` through `.animate-stagger-5` - Pre-defined stagger delays

---

## Best Practices Applied

✅ **Consistent timing:** All entrance animations are 0.5-0.6s  
✅ **Smooth easing:** All use `ease-out` or `ease-in-out` for natural motion  
✅ **GPU acceleration:** Animations use `transform` and `opacity` properties  
✅ **Purposeful delays:** Stagger creates visual rhythm, not confusion  
✅ **Accessibility:** No infinite animations that distract from content  
✅ **Performance:** No layout thrashing, hardware accelerated  
✅ **Scalability:** Pattern-based approach easy to extend

---

## Common Implementation Mistakes to Avoid

❌ **Don't:** Apply animations to every element
- Can cause visual overload and performance issues

✅ **Do:** Apply animations strategically to sections and grids

---

❌ **Don't:** Use identical delays for multiple elements
- Creates visual clutter and confusion

✅ **Do:** Use staggered delays with consistent increments

---

❌ **Don't:** Mix different animation durations randomly
- Breaks visual consistency

✅ **Do:** Use standard durations (0.5s, 0.6s, 15s for continuous)

---

❌ **Don't:** Forget about mobile performance
- Complex animations can cause lag on mobile

✅ **Do:** Test on mobile and use efficient animation properties (transform, opacity)

---

## Future Enhancement Opportunities

1. **Scroll-triggered animations:** Animate elements as they enter viewport
2. **Parallax effects:** Subtle depth in hero sections
3. **Hover state animations:** More elaborate hover effects for interactive elements
4. **Gesture animations:** Mobile-specific swipe animations
5. **Route transitions:** Page transition animations when navigating
6. **prefers-reduced-motion:** Respect user accessibility preferences

---

## Summary

The animation system creates a cohesive, professional user experience through:
- **Consistent timing:** All animations feel unified
- **Strategic placement:** Animations guide user attention
- **Performance:** Hardware acceleration ensures smooth 60fps
- **Accessibility:** Purposeful animations that enhance, not distract
- **Scalability:** Pattern-based approach for future pages

Result: **A polished, modern website that feels responsive and engaging.**

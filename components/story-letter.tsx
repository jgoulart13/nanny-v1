// The "We're Boston parents too." letter, shared by the home page card and
// /how-it-works#our-story so the two never drift apart.
// Copy approved in step 02e.
// TODO(jonathan): revisit story copy

export function StoryLetter({ className = "text-lg" }: { className?: string }) {
  return (
    <>
      <p className={`mt-4 ${className}`}>
        When our son arrived, we were running on very little sleep and trying
        to make some of the biggest decisions of our lives. Who do we trust
        with him? What&apos;s fair to pay? Wait, are we someone&apos;s employer
        now?
      </p>
      <p className={`mt-3.5 ${className}`}>
        In one year we tried almost everything: a night nanny, a nanny we found
        on Facebook, and a daycare search in a crunch when our nanny had a
        family emergency. Every step came with late-night searching, a lot of
        second-guessing, and very few straight answers.
      </p>
      <p className={`mt-3.5 ${className}`}>
        This site is our way of bringing a little method to the madness. If
        you&apos;re in the middle of it right now: it&apos;s hard, you&apos;re
        doing better than you think, and you don&apos;t have to figure it out
        alone.
      </p>
    </>
  );
}

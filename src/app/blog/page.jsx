import Image from "next/image";

export default function BlogPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <section className="text-center mb-12">
        <span className="badge badge-primary mb-4">Parenting • Learning</span>
        <h1 className="text-4xl font-bold leading-tight mt-3">
          Why Learning Toys Are Important for Early Childhood
        </h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Play is not just fun — it’s the foundation of learning, creativity,
          and problem-solving for children.
        </p>
      </section>

      {/* Featured Image */}
      <section className="mb-10">
        <Image
          width={600}
          height={420}
          src="https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8"
          alt="Kids learning toys"
          className="w-full h-[420px] object-cover rounded-2xl shadow"
        />
      </section>

      {/* Blog Content */}
      <article className="prose prose-lg max-w-none">
        <p>
          Childhood is the most important phase of human development. During
          these early years, children learn faster than at any other time in
          life. One of the most effective ways to support this learning process
          is through <strong>educational toys</strong>.
        </p>

        <h2>Learning Through Play</h2>
        <p>
          Learning toys help children understand numbers, shapes, colors, and
          basic logic without pressure. When kids play, they naturally explore,
          experiment, and solve problems. This kind of learning stays with them
          much longer than traditional memorization.
        </p>

        <blockquote>
          “Play is the highest form of research.” — Albert Einstein
        </blockquote>

        <h2>Boosting Cognitive Development</h2>
        <p>
          Toys like number boards, puzzles, and building blocks strengthen
          memory, focus, and reasoning skills. Children begin to recognize
          patterns, make decisions, and think independently.
        </p>

        <ul>
          <li>Improves logical thinking</li>
          <li>Builds early math skills</li>
          <li>Enhances problem-solving ability</li>
        </ul>

        <h2>Encouraging Confidence & Creativity</h2>
        <p>
          When children successfully complete a task or solve a puzzle, it
          boosts their confidence. Creative toys also allow kids to imagine,
          design, and express themselves freely — an essential life skill.
        </p>

        <h2>Safe & Meaningful Play</h2>
        <p>
          Modern educational toys are designed with child safety in mind. Using
          non-toxic materials and age-appropriate designs ensures that kids can
          learn safely at home or school.
        </p>

        <p>
          Investing in learning toys is not just buying a product — it’s
          investing in your child’s future.
        </p>
      </article>

      {/* Author Box */}
      <section className="mt-16 flex items-center gap-4 p-6 bg-base-200 rounded-2xl">
        <img
          src="https://i.pravatar.cc/100?img=12"
          className="w-16 h-16 rounded-full"
          alt="Author"
        />
        <div>
          <h4 className="font-semibold">ToyLearn Editorial Team</h4>
          <p className="text-sm text-gray-600">
            Writing about child development, learning psychology, and play-based
            education.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Explore Learning Toys for Your Child
        </h3>
        <button className="btn btn-primary btn-wide">
          Browse Educational Toys
        </button>
      </section>
    </main>
  );
}
